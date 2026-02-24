import ComingSoon from "@/components/ui/ComingSoon"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Contains contact information for Sehetna",
    alternates: {
        canonical: "/support/contact-us",
    },
}

const ContactUsPage = () => {
    return (
        <ComingSoon
            title="Contact Us"
            description="Review Sehetna's terms of service, privacy policy, and cookie usage guidelines."
        />
    )
}

export default ContactUsPage
