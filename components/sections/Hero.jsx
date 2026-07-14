import Image from "next/image";
import Button from "../ui/Button";

export default function Hero() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 max-w-[620px]">
            <h1 className="font-display text-[36px] md:text-[40px] lg:text-[62px] font-semibold leading-[1.1] text-navy mb-6">
              Make Marketing, Sales, and Service One Machine
            </h1>
            <p className="font-body text-[15px] md:text-base lg:text-lg text-text-mid leading-relaxed mb-8">
              I coach founder-led B2B companies from $3M to $50M to build the
              systems that turn growth into profit, not just more payroll.
              More money, less chaos.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
              <Button href="/book" size="large">
                Book a Free Discovery Call
              </Button>
              <Button href="/watch" variant="ghost">
                Watch how it works
              </Button>
            </div>
            <p className="font-body text-sm text-text-mid">
              <span className="text-green font-medium">RevOps systems built across 25+ companies</span>
              {" · "}Sales cycles cut in half{" · "}$1M+ in churn saved
            </p>
          </div>

          <div className="flex-shrink-0">
            <div className="w-64 h-80 md:w-72 md:h-96 rounded-[18px] overflow-hidden">
              <Image
                src="/images/bradley-headshot.jpg"
                alt="Bradley de Wet, founder of Modern BizOps"
                width={288}
                height={384}
                sizes="(max-width: 768px) 256px, 288px"
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
