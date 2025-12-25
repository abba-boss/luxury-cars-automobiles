import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const CartButton = () => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <Button variant="outline" size="sm" asChild className="relative">
      <Link to="/cart">
        <ShoppingCart className="w-4 h-4" />
        {itemCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {itemCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
};

export default CartButton;
