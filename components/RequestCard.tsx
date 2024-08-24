import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";
import { Separator } from "./ui/separator";

// Dynamically import the Map component with SSR disabled
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

interface RequestCardProps {
  id: string;
  location: string;
  dateTime: Date;
  price: number;
  requesterName: string;
  position: [number, number];
}

export const RequestCard: React.FC<RequestCardProps> = ({
  id,
  location,
  dateTime,
  price,
  requesterName,
  position,
}) => {
  return (
    <Card className="w-full max-w-sm shadow-2xl shadow-primary/40 rounded-lg p-6 space-y-4 border-[1px] border-primary/40 border-dashed">
      <div className="w-full mb-4 h-[250px]">
        <Map
          initialPosition={position}
          markers={[position]}
          showCurrentLocationMarker={false}
          height="250px"
        />
      </div>
      <CardHeader>
        <CardTitle>{location}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <p>
          <span className="text-primary">Date: </span>
          {new Date(dateTime).toLocaleDateString()}
        </p>
        <p>
          <span className="text-primary">Time: </span>
          {new Date(dateTime).toLocaleTimeString()}
        </p>
        <p>
          <span className="text-primary">Price: </span> ${price.toFixed(2)}
        </p>
        <p>
          <span className="text-primary">Requested by: </span>
          {requesterName}
        </p>
      </CardContent>
      <Separator />
      <CardFooter>
        <Link href={`/request/${id}`} passHref>
          <Button>More Information</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
