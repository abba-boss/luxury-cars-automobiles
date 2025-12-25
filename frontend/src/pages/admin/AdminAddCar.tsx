import AdminLayout from '@/components/layout/AdminLayout';
import VehicleForm from '@/components/admin/VehicleForm';

const AdminAddCar = () => {
  return (
    <AdminLayout>
      <VehicleForm mode="create" />
    </AdminLayout>
  );
};

export default AdminAddCar;
