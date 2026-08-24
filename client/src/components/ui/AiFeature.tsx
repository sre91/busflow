import { Bot, Sparkles } from "lucide-react";

import Button from "./Button";

function AiFeature() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary-dark p-8 text-white shadow-lg md:p-12">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative grid items-center gap-10 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <Bot size={26} />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold">BusFlow AI</span>

              <Sparkles size={16} className="text-accent" />
            </div>
          </div>

          <h2 className="mt-6 text-3xl font-bold md:text-4xl">
            Your smart travel assistant.
          </h2>

          <p className="mt-5 max-w-xl leading-7 text-slate-300">
            Get smarter travel suggestions, compare journeys, and find buses
            that match the way you want to travel.
          </p>

          <div className="mt-8">
            <Button>
              <span className="flex items-center gap-2">
                <Sparkles size={18} />
                Try BusFlow AI
              </span>
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <p className="text-sm text-slate-400">Try asking</p>

          <div className="mt-4 rounded-xl bg-white/10 p-4">
            <p className="text-sm leading-6 text-white">
              "Find me a sleeper bus from Chennai to Bangalore tomorrow under
              ₹1000."
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-accent">
            <Sparkles size={16} />
            <span>BusFlow AI is ready to help</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiFeature;
