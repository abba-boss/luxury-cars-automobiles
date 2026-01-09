const { Sale, Conversation, ConversationParticipant, OrderConversation, User, Message } = require('./models');

async function migrateExistingOrders() {
  try {
    console.log('Starting migration of existing orders...');

    // Find all sales that don't have an order conversation
    const salesWithoutConversation = await Sale.findAll({
      include: [
        {
          model: OrderConversation,
          as: 'orderConversation',
          required: false
        }
      ],
      where: {
        '$orderConversation.id$': null
      }
    });

    console.log(`Found ${salesWithoutConversation.length} orders without conversations`);

    // Find an admin user
    const adminUser = await User.findOne({
      where: { role: 'admin', status: 'active' }
    });

    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.');
      return;
    }

    console.log(`Using admin user: ${adminUser.full_name} (ID: ${adminUser.id})`);

    for (const sale of salesWithoutConversation) {
      console.log(`\nProcessing order #${sale.id}...`);

      // Get vehicle details
      const saleWithVehicle = await Sale.findByPk(sale.id, {
        include: [
          { model: require('./models').Vehicle, as: 'vehicle' }
        ]
      });

      if (!saleWithVehicle.vehicle) {
        console.log(`  Skipping - no vehicle found`);
        continue;
      }

      // Create conversation
      const conversation = await Conversation.create({
        type: 'private',
        created_by: sale.user_id || adminUser.id,
        name: `Order #${sale.id} - ${saleWithVehicle.vehicle.make} ${saleWithVehicle.vehicle.model}`
      });

      console.log(`  Created conversation #${conversation.id}`);

      // Add participants
      const participants = [
        {
          conversation_id: conversation.id,
          user_id: sale.user_id || adminUser.id,
          role: 'sender'
        },
        {
          conversation_id: conversation.id,
          user_id: adminUser.id,
          role: 'recipient'
        }
      ];

      // Remove duplicate if user is admin
      const uniqueParticipants = participants.filter((p, index, self) =>
        index === self.findIndex((t) => t.user_id === p.user_id)
      );

      await ConversationParticipant.bulkCreate(uniqueParticipants);
      console.log(`  Added ${uniqueParticipants.length} participant(s)`);

      // Link order to conversation
      await OrderConversation.create({
        sale_id: sale.id,
        conversation_id: conversation.id,
        status: 'active'
      });

      console.log(`  Linked order to conversation`);

      // Create initial system message
      await Message.create({
        conversation_id: conversation.id,
        sender_id: sale.user_id || adminUser.id,
        content: `Order created for ${saleWithVehicle.vehicle.make} ${saleWithVehicle.vehicle.model} (${saleWithVehicle.vehicle.year})\nPrice: $${sale.sale_price}\n\nYour order has been received and is pending confirmation from our team.`,
        message_type: 'system'
      });

      console.log(`  Created initial system message`);
      console.log(`  ✓ Order #${sale.id} migration complete`);
    }

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration
migrateExistingOrders()
  .then(() => {
    console.log('\nExiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nExiting with error...');
    process.exit(1);
  });
