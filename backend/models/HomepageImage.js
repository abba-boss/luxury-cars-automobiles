module.exports = (sequelize, DataTypes) => {
  const HomepageImage = sequelize.define('HomepageImage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cta_text: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cta_link: {
      type: DataTypes.STRING,
      allowNull: true
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    section_type: {
      type: DataTypes.ENUM('hero', 'banner', 'testimonial', 'feature', 'promotion'),
      allowNull: false,
      defaultValue: 'hero'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW
    }
  }, {
    tableName: 'homepage_images',
    timestamps: false, // We're managing created_at and updated_at manually
    indexes: [
      {
        unique: true,
        fields: ['position', 'section_type']
      }
    ]
  });

  return HomepageImage;
};