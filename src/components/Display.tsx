"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Doc } from "../../convex/_generated/dataModel";
import { useMemo, useRef } from "react";
import Link from "next/link";
import { CopyIcon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"


export const Display = () => {
  const viewData = useQuery(api.links.viewer);
  return <ScrollArea className="flex flex-col h-[40rem] items-start justify-center gap-y-4">{viewData?.map((item) => <ShortLink item={item} />)}</ScrollArea>;
};

const ShortLink = ({ item }: { item: Doc<"links"> }) => {
  const thisLinkRef = useMemo(() => {
    return `localhost:3000/${item.name}`;
  }, [item]);
  return (
    <Card key={item._id} className=" max-w-lg mx-auto p-4 my-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="">
          <Link href={`http://${thisLinkRef}`}>{thisLinkRef.substring(0, 34).concat(`...`)}</Link>
        </CardTitle>
        <CardDescription>
          <Button variant={`ghost`} onClick={() => navigator.clipboard.writeText(`http://${thisLinkRef}`)}>
            <CopyIcon />
          </Button>
          <Button variant={`ghost`}>
            <MixerHorizontalIcon />
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent className="max-w-52 flex flex-col gap-2 sm:max-w-72 w-full text-xs text-muted-foreground">
        <Link href={`http://${thisLinkRef}`} className="truncate" target="_blank" rel="noopener noreferrer">
          {item.url}
        </Link>
      </CardContent>
    </Card>
  );
};
