export const GA_MEASUREMENT_ID = "G-Z6WJF5K49D";

export function trackEvent(eventName, params) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

export function trackCTAClick(destination, label) {
  trackEvent("cta_click", {
    cta_destination: destination,
    cta_label: label,
  });
}

export function trackFormSubmit(formName, formData) {
  trackEvent("form_submit", {
    form_name: formName,
    ...formData,
  });
}

export function trackLeadGenerated(method) {
  trackEvent("generate_lead", {
    method: method,
    currency: "USD",
    value: 1,
  });
}
