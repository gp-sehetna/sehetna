import ContactUsForm from "./ContactUsForm"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Reach out to Sehetna for support, partnerships, or general questions.",
    alternates: {
        canonical: "/support/contact-us",
    },
}

const ContactUsPage = () => {
    return <ContactUsForm />
}

export default ContactUsPage
