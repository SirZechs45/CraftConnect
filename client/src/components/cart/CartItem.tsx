import { useState } from "react";
import { Link } from "wouter";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";

interface CartItemProps {
  id: number;
  productId: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
  maxQuantity: number;
}

export default function CartItem({
  id,
  productId,
  title,
  price,
  quantity,
  image,
  maxQuantity,
}: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const [itemQuantity, setItemQuantity] = useState(quantity);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (isNaN(newQuantity) || newQuantity < 1) {
      setItemQuantity(1);
      updateQuantity(id, 1);
    } else if (newQuantity > maxQuantity) {
      setItemQuantity(maxQuantity);
      updateQuantity(id, maxQuantity);
    } else {
      setItemQuantity(newQuantity);
      updateQuantity(id, newQuantity);
    }
  };

  const incrementQuantity = () => {
    if (itemQuantity < maxQuantity) {
      const newQuantity = itemQuantity + 1;
      setItemQuantity(newQuantity);
      updateQuantity(id, newQuantity);
    }
  };

  const decrementQuantity = () => {
    if (itemQuantity > 1) {
      const newQuantity = itemQuantity - 1;
      setItemQuantity(newQuantity);
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeItem(id);
  };

  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  // Calculate subtotal
  const subtotal = price * itemQuantity;
  const formattedSubtotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(subtotal);

  return (
    <div className="flex items-start py-4 border-b">
      {/* Product Image */}
      <div className="flex-shrink-0 mr-4">
        <Link href={`/products/${productId}`}>
          <img
            src={image}
            alt={title}
            className="w-16 h-16 object-cover rounded-md"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <Link href={`/products/${productId}`}>
          <h3 className="font-medium text-gray-800 hover:text-primary">
            {title}
          </h3>
        </Link>

        <div className="mt-1 flex justify-between items-center">
          <span className="text-gray-600">{formattedPrice}</span>
          <span className="text-sm text-gray-500">
            Subtotal: {formattedSubtotal}
          </span>
        </div>

        <div className="mt-2 flex justify-between items-center">
          {/* Quantity Selector */}
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={decrementQuantity}
              disabled={itemQuantity <= 1}
            >
              -
            </Button>
            <Input
              type="number"
              min="1"
              max={maxQuantity}
              value={itemQuantity}
              onChange={handleQuantityChange}
              className="h-8 w-14 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={incrementQuantity}
              disabled={itemQuantity >= maxQuantity}
            >
              +
            </Button>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-red-500"
            onClick={handleRemove}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
