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
    </section>
  );
}
