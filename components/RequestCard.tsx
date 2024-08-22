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
    <Card className="w-full max-w-sm">
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
