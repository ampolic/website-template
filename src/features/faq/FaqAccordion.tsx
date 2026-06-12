import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FaqAccordionProps = {
  items: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
};

export default function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="mx-auto max-w-3xl rounded-lg border px-5"
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>
            <p className="text-muted-foreground leading-6">{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
