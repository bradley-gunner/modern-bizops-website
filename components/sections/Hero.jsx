import Image from "next/image";
import Button from "../ui/Button";

export default function Hero() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 max-w-[620px]">
            <h1 className="font-display text-[40px] md:text-[62px] font-semibold leading-[1.1] text-navy mb-6">
              Grow Your Revenue Without Growing Your Headcount
            </h1>
            <p className="font-body text-lg md:text-xl text-text-mid leading-relaxed mb-8">
              I help $3M–$15M companies build the sales, marketing, and delivery
              systems that turn growth into profit, not just more payroll.
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
              <span className="text-green font-medium">15+ high-growth companies transformed</span>
              {" · "}Sales cycles cut in half{" · "}$1M+ in churn saved
            </p>
          </div>

          <div className="flex-shrink-0">
            <div className="w-64 h-80 md:w-72 md:h-96 rounded-[18px] overflow-hidden">
              <Image
                src="/images/bradley-headshot.jpg"
                alt="Bradley de Wet, Revenue Operations Coach"
                width={288}
                height={384}
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
