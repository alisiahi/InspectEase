import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RequestCardProps {
  id: string;
  location: string;
  dateTime: Date;
  price: number;
  requesterName: string;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  id,
  location,
  dateTime,
  price,
  requesterName,
}) => {
  return (
    <Card className="w-full max-w-sm shadow-2xl shadow-primary/40 rounded-lg p-6 space-y-4 border-[1px] border-primary/40 border-dashed">
      <CardHeader>
        <CardTitle>{location}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Date: {new Date(dateTime).toLocaleDateString()}</p>
        <p>Time: {new Date(dateTime).toLocaleTimeString()}</p>
        <p>Price: ${price.toFixed(2)}</p>
        <p>Requested by: {requesterName}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/request/${id}`} passHref>
          <Button>More Information</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
