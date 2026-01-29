import logger from "@/shared/logger"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const mySwal = Swal.mixin({
    showCloseButton: true,
    showClass: {
        popup: "animate__animated animate__fadeInDown animate_faster",
    },
    hideClass: {
        popup: "animate__animated animate__zoomOut animate_faster",
    },
    didOpen: (popup) => {
        const titleEl = popup.querySelector(".swal2-title")
        const title = titleEl?.textContent ?? "NO_TITLE"

        logger.info(`[SWAL OPENED] ${title}`)
    },
})

const toast = withReactContent(
    mySwal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 4000,
        customClass: {},
        timerProgressBar: true,
    })
)

const popup = withReactContent(mySwal.mixin({}))

const Alert = { toast, popup }

export default Alert
