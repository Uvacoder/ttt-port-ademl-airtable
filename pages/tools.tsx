import PageTransition from "@/components/page-transition";
import Tool from "@/components/tool-card";
import { AnimatePresence } from "framer-motion";
import type { ITool } from "@/types/index";
import { useState } from "react";
import Segmented from "@/components/segmented";
import Container from "@/components/container";
import Title from "@/components/title";

export default function ToolsPage({ data }) {
  const defaultFilter: string = "all";
  const [selectedTab, setSelectedTab] = useState<string>(defaultFilter);

  const categories = [
    ...new Set(data.flatMap((tool: ITool) => tool.category) as string[]),
  ];

  return (
    <PageTransition
      title="Araçlar"
      description="Gün içinde ve çalışma hayatında sürekli kullandığım araçların listesi."
    >
      <Container>
        <Title>
          Gün içinde ve çalışma hayatında sürekli kullandığım araçların listesi.
          Bana yaşattıkları deneyim üzerinden puan ve yorumumu ekledim.
        </Title>

        <Segmented
          className="mt-10"
          fullWidth
          data={[defaultFilter, ...categories]}
          onChange={setSelectedTab}
          selected={selectedTab}
          buttonProps={{
            className: "capitalize",
          }}
        />
      </Container>

      <Container size="large" className="mt-20">
        <div className="grid items-start gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
          <AnimatePresence>
            {data
              .filter((tool: ITool) => {
                if (selectedTab === defaultFilter) return true;
                return tool.category.includes(selectedTab);
              })
              .map((tool: ITool) => {
                return <Tool key={tool.id} tool={tool} />;
              })}
          </AnimatePresence>
        </div>
      </Container>
    </PageTransition>
  );
}

export async function getStaticProps() {
  const res = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Tools`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
    }
  );
  const tools = await res.json();

  const data: ITool[] = tools.records.map((r) => {
    return { id: r.id, createdTime: r.createdTime, ...r.fields };
  });

  return {
    props: {
      data,
    },
  };
}