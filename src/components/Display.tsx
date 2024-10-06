"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Doc } from "../../convex/_generated/dataModel";
import { ForwardRefExoticComponent, ReactNode, RefAttributes, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CheckIcon, CopyIcon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Button, ButtonProps } from "./ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"


export const Display = () => {
  const viewData = useQuery(api.links.viewer);
  return <ScrollArea className="flex flex-col h-[40rem] items-start justify-center gap-y-4">{viewData?.map((item) => <ShortLink key={item._id} item={item} />)}</ScrollArea>;
};

const ShortLink = ({ item }: { item: Doc<"links"> }) => {
  const thisLinkRef = useMemo(() => {
    return `localhost:3000/${item.name}`;
  }, [item]);
  return (
    <Card  className=" max-w-lg mx-auto p-4 my-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="">
          <Link href={`http://${thisLinkRef}`}>{thisLinkRef.substring(0, 34).concat(`...`)}</Link>
        </CardTitle>
        <CardDescription>
          <CopyButton text={thisLinkRef}/>
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

interface CopyButtonProps extends Partial<ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>>> {
  children?:ReactNode;
  text?:string;
}

export const CopyButton = ({children , text , ...props}:CopyButtonProps) =>{
  const [copy,setCopy] = useState(false)

  const copyMe = () => {
    navigator.clipboard.writeText(`http://${text}`);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 1000); 
  };

  return <Button {...props} variant={`ghost`} onClick={copyMe}>
    {!copy ? <CopyIcon />: <CheckIcon />}
  </Button>
}