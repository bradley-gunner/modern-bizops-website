import Button from "../ui/Button";

export default function MidPageCTA() {
  return (
    <section className="py-16 md:py-20 bg-navy text-white text-center">
      <div className="mx-auto max-w-[720px] px-6 md:px-8">
        <p className="font-display text-[26px] md:text-[32px] font-semibold mb-6">
          See results like these? Let&apos;s talk.
        </p>
        <Button href="/book" size="large">
          Book Your Free Discovery Call
        </Button>
      </div>
    </section>
  );
}
