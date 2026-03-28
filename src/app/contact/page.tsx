import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "変換野郎へのご質問・ご要望・不具合報告はこちらからどうぞ。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-2">
        お問い合わせ<span className="text-accent">フォーム</span>
      </h1>
      <p className="text-muted text-sm mb-12">
        ご質問・ご要望・不具合報告などお気軽にどうぞ。
      </p>
      <ContactForm />
    </div>
  );
}
