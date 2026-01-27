import { MissingDataAlert } from "@/components/alerts/MissingDataAlert"
import Alert from "@/lib/alert/swal"

const confirmMissingData = async (missingKeys: string[]) => {
    const result = await Alert.popup.fire({
        icon: "warning",
        title: "Incomplete Environment Data",
        html: <MissingDataAlert missingKeys={missingKeys} />,
        showCancelButton: true,
        confirmButtonText: "Continue anyway",
        cancelButtonText: "Modify inputs",
        reverseButtons: true,
        allowOutsideClick: false,
        focusCancel: true,
    })

    return result.isConfirmed
}

export { confirmMissingData }
