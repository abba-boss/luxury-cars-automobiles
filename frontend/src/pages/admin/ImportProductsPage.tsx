import ProductSearchForm from "@/components/admin/ProductSearchForm";
import AdminLayout from "@/components/layout/AdminLayout";

export default function ImportProductsPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Import Real Products</h1>
          <p className="text-muted-foreground">
            Search for real luxury cars from official sources and import them with high-quality images and detailed information
          </p>
        </div>
        
        <ProductSearchForm />
      </div>
    </AdminLayout>
  );
}