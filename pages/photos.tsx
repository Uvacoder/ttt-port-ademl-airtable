import unsplash from "lib/unsplash";
import PageTransition from "components/page-transition";
import dynamic from "next/dynamic";
import { meta } from "../site.config";
import MetricCard from "components/metric-card";
import Head from "next/head";
import Text from "components/text";
import ms from "ms";

const Photos = dynamic(() => import("components/photos"), {
  ssr: false,
});

function PhotosPage({ photos, stats }) {
  return (
    <PageTransition>
      <Head>
        <title>Photos - Adem ilter</title>
      </Head>

      <div className="c-small">
        <Text as="h2" size="pageTitle">
          Fotoğraf çekmek etrafımdaki şeyleri daha iyi görmemi sağlıyor. Çevrem
          hakkında farkındalığı, detayları görebilmemi ve doğru anı
          yakalabilmeyi öğretiyor.
        </Text>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 sm:gap-8">
          <MetricCard href={meta.social.unsplash} data={stats.views.total}>
            Unsplash Views
          </MetricCard>
          <MetricCard href={meta.social.unsplash} data={stats.downloads.total}>
            Unsplash Downloads
          </MetricCard>
        </div>
      </div>

      <div className="c-large mt-20">
        <Photos data={photos} />
      </div>
    </PageTransition>
  );
}

export async function getStaticProps() {
  const photos = await unsplash.getPhotos();
  const stats = await unsplash.getStats();

  return {
    props: {
      photos,
      stats,
    },
    revalidate: ms("1d") / 1000,
  };
}

export default PhotosPage;
