import PageTransition from "@/components/page-transition";
import AppCard from "@/components/app-card";
import { useState } from "react";
import Segmented from "@/components/segmented";
import type { IApp } from "@/types/index";
import Container from "@/components/container";
import Title from "@/components/title";

export default function AppsPage({ data }) {
  const [selectedTab, setSelectedTab] = useState("iOS");

  const os = [...new Set(data.flatMap((tool: IApp) => tool.os) as string[])];

  return (
    <PageTransition
      title="Uygulamalar"
      description="Uzun süredir kullandığım ve memnun kaldığım uygulamaların listesi."
    >
      <Container>
        <Title>
          Uzun süredir kullandığım ve memnun kaldığım uygulamaların listesi.
        </Title>

        <Segmented
          className="mt-10"
          fullWidth
          data={os}
          onChange={setSelectedTab}
          selected={selectedTab}
        />

        <div className="mt-10 divide-y divide-zinc-100 dark:divide-zinc-800">
          {data
            .filter((item) => item.os.includes(selectedTab))
            .map((item) => (
              <AppCard key={item.id} {...item} />
            ))}
        </div>
      </Container>
    </PageTransition>
  );
}

export async function getStaticProps() {
  const res = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Apps`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
    }
  );
  const apps = await res.json();

  const data: IApp[] = apps.records.map((r) => {
    return { id: r.id, createdTime: r.createdTime, ...r.fields };
  });

  return {
    props: {
      data,
    },
  };
}