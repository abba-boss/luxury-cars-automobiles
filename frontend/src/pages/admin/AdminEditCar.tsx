import { useParams } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import VehicleForm from '@/components/admin/VehicleForm';

const AdminEditCar = () => {
  const { id } = useParams<{ id: string }>();
  const vehicleId = id ? parseInt(id) : undefined;

  if (!vehicleId) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-red-600">Invalid Vehicle ID</h1>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <VehicleForm mode="edit" vehicleId={vehicleId} />
    </AdminLayout>
  );
};

export default AdminEditCar;
