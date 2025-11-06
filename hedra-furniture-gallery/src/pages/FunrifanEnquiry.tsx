import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { apiPostRequest } from "../../service"; // <-- adjust path if needed
import { Toaster, toast } from "sonner"; // <-- add

export default function FunrifanEnquiry() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    enquiry: "",
  });

  const onChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [key]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    if (!form.name || !form.email || !form.enquiry) {
      toast.error("Please fill Name, Email and Your Enquiry."); // <-- toast
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.enquiry,
        subject: "Funrifan Enquiry",
      };

      const res = await apiPostRequest("contact/createcontact", payload);
      const desc =
        res?.message ||
        res?.data?.message ||
        "Thanks! We received your enquiry and will get back within 24 hours.";

      toast.success("Thanks! We received your enquiry and will get back within 24 hours.");
      setForm({ name: "", email: "", phone: "", enquiry: "" });
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit enquiry.";
      toast.error(msg); 
      console.error("Funrifan createcontact error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      {/* Full-width white box between header & footer */}
      <main className="flex-1">
        <section className="w-full bg-white border-y shadow-sm">
          {/* Full width grid; no max-width container */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: collage (hidden on mobile) */}
            <aside className="hidden md:block bg-gray-50">
              <div className="grid grid-cols-2 gap-4 p-8 h-full">
                <div className="grid grid-rows-2 gap-4">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIKipZDKDKFu0_hZlrSOlz9-7AqXsvKQpY4ekupGQ7_hxxzhggHIuUFVhsEzRpXFFLVQctXcVvCBbG8HbBla3XkXHZBWkLYgOBkNP5-CDKZpeOU7H4jK4E4YuhLLJttFfUcGkNbFjGQV2IdNBpJdsoxh5loDvKmOinAEhp4gJp8xlKGdu6LjXU3A26v0KjcPAgO6yXc3q8J13QB8inQegr32w-GPuwP9mJIgngG1jrD6zzm4zipMzyiZVd6yw-RjxEJf63oXZpxLQ"
                    alt="Chaise lounge"
                    className="rounded-xl object-cover w-full h-full"
                  />
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsW3crVPrJNw6pWMQ9vYRfP5M6YwgVsSzlsBWge9macvwxN002SO7AzDZq6qww-DZcMmfTzIYhDIZOfSgcrpXXpzew6241I6FKGa-rwnKFaxyahzrDpGME7jC3doODOQ6c4ed-8kgYztbZqxvKunn5AbvfdCmnqSi-jGX6BH3mpP9bEvkgK3Esd2QfTvwsxu9z6Y-OWXg8tJVCiIH9FKu6ED8sn4IK6RiiPbrV683MpiEwQE1_0e2K2KWQopAN5QIPx74396kZSpA"
                    alt="Modern chair"
                    className="rounded-xl object-cover w-full h-full"
                  />
                </div>
                <div className="grid grid-rows-3 gap-4">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKxaFtzUhV7aBzG6Ndhk-_X3EqojZhryK3Q3nQbv1mkhEABoyOIatQBrQFGTxY5xIcRw6Y4dB2Q7uOGklWJalIgzfojSauBiT0qO7iaYyVERMjLYE8CMHbYGJWAVrvo_omLGZ_LDfCTI5rKswTUNzIg4_7i51uyKSzvHK0o1CMLUw6-yAALsIoktSBuxV4ZWMr570gXcfIK8t38B9by7Y9q1B5MXvixotdrxqnUYmzYOFOjv9hsiNfX7-xce9XGNj70buioVhiH4k"
                    alt="Wooden armchair"
                    className="rounded-xl object-cover w-full h-full"
                  />
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_q_06EYh9ZasAkYjXKvYQH09ASfI3ilvNZnjIbOdDM59bKLh4U6I9SDmEo7PfXd5yyX16agoHRRfKVnSQ3ilNO24i60hij0-C9SjWctFoi9OZx9NbKblxQBx1Mm9028b6Qrotog1MSJ-xWEyhI3o1Q6YT6KWEk3W8Ta4MZWeOZy3rZBRsTJUQE7rn_mPcZMSa6HfvZJx8gu5nwHrs6QB04tmDqOm4MPkQQ56uR_yQHC3ugKpoDugaS702es_at-CwY1FoaoteeLg"
                    alt="Vintage chairs"
                    className="rounded-xl object-cover w-full h-full"
                  />
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjWSIbaOkXY7F0MATwlRqw6AwNOBJMkyTrY2y447EiuMEuwadOcelvK9jJpnR6k0NyCdEpjhRP7zv-Ic3HucyoTWkdXIts5ygKW3pbW1v2YooLKUraC49Dld3ouZ2Y4-H3JD6VenWdsOI7UVTP4Gf-lBOa5bw64SYfoNbEpJMOb1mGJC2z5diPUhBMgHTcDMbcE1yheZe_3TnR1hHkQjV6RpAQLXQ1XTShzYCG62HdTPFkl1sMpxCmE2XzHhxvlzbmpeqRG3HGdNo"
                    alt="Scandinavian chair"
                    className="rounded-xl object-cover w-full h-full"
                  />
                </div>
              </div>
            </aside>

            {/* Right: form */}
            <section className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold">
                  <span className="text-slate-800">Funrifan Enquiry</span>
                </h1>
              </div>

              <p className="text-slate-500 mb-6">
                Have a question? Fill out the form below.
              </p>

              {/* Status message */}
              {status && (
                <div
                  className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
                    status.type === "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {status.msg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-slate-600 mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={onChange("name")}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="email" className="block text-slate-600 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={onChange("email")}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="phone" className="block text-slate-600 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={onChange("phone")}
                  />
                </div>

                <div>
                  <label htmlFor="enquiry" className="block text-slate-600 mb-2">
                    Your Enquiry
                  </label>
                  <textarea
                    id="enquiry"
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    value={form.enquiry}
                    onChange={onChange("enquiry")}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-60"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Enquiry"}
                </button>
              </form>

              <div className="text-center text-slate-600 mt-8">
                <p>Or contact us directly:</p>
                <div className="flex justify-center items-center gap-6 mt-4">
                  <a
                    href="mailto:info@funrifan.com"
                    className="flex items-center text-slate-500 hover:text-red-500"
                  >
                    <span className="material-symbols-outlined mr-2">mail</span>
                    info@edendek.com
                  </a>
                  <a
                    href="tel:+1234567890"
                    className="flex items-center text-slate-500 hover:text-red-500"
                  >
                    <span className="material-symbols-outlined mr-2">call</span>
                    +1 234 567 890
                  </a>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
      <Toaster richColors position="bottom-left" />
    </div>
  );
}
