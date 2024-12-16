import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

const CardComponent = ({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) => {
  return (
    <Card className="w-full max-w-[300px] sm:max-w-[180px] md:max-w-[200px] aspect-square">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>
          <Link href={`${url}`}>{url}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default CardComponent;
