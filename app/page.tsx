import { Alert } from "@nextui-org/alert";
import { Button } from "@nextui-org/button";

import { title } from "@/components/primitives";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>Gjaldmiðlar</h1>
        <br />
        <h2 className={title({ color: "violet" })}>
          Algengir gjaldmiðlar og rafmyntir&nbsp;
        </h2>
      </div>
      <div className="flex items-center justify-center w-full">
        <Alert
          color="warning"
          description="Upgrade to a paid plan to continue"
          endContent={
            <Button color="warning" size="sm" variant="flat">
              Upgrade
            </Button>
          }
          title="You have no credits left"
          variant="faded"
        />
      </div>
      c
    </section>
  );
}
