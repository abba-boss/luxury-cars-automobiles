import { localDb } from './database';

export const initializeSampleData = () => {
  // Check if data already exists
  if (localDb.vehicles.findMany().length > 0) return;

  // Add sample vehicles
  const sampleVehicles = [
    {
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      price: 25000,
      mileage: 15000,
      fuel_type: 'Gasoline',
      transmission: 'Automatic',
      body_type: 'Sedan',
      color: 'Silver',
      description: 'Well-maintained Toyota Camry with low mileage'
    },
    {
      make: 'Honda',
      model: 'Civic',
      year: 2021,
      price: 22000,
      mileage: 20000,
      fuel_type: 'Gasoline',
      transmission: 'Manual',
      body_type: 'Sedan',
      color: 'Blue',
      description: 'Reliable Honda Civic in excellent condition'
    },
    {
      make: 'Ford',
      model: 'F-150',
      year: 2023,
      price: 35000,
      mileage: 8000,
      fuel_type: 'Gasoline',
      transmission: 'Automatic',
      body_type: 'Truck',
      color: 'Black',
      description: 'Powerful Ford F-150 pickup truck'
    }
  ];

  sampleVehicles.forEach(vehicle => {
    localDb.vehicles.create(vehicle);
  });

  // Add sample customers
  const sampleCustomers = [
    {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1234567890',
      address: '123 Main St, City, State'
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1987654321',
      address: '456 Oak Ave, City, State'
    }
  ];

  sampleCustomers.forEach(customer => {
    localDb.customers.create(customer);
  });
};
