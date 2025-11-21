import toast from 'react-hot-toast';

export const factoryToast = {
    loading: (message: string) => {
        return toast.loading(message, {
            className: 'factory-toast factory-toast-loading',
            duration: Infinity,
            icon: '⚙️',
        });
    },

    success: (message: string, toastId?: string) => {
        if (toastId) {
            toast.success(message, {
                id: toastId,
                className: 'factory-toast factory-toast-success',
                duration: 4000,
                icon: '✅',
            });
        } else {
            toast.success(message, {
                className: 'factory-toast factory-toast-success',
                duration: 4000,
                icon: '✅',
            });
        }
    },

    error: (message: string, toastId?: string) => {
        if (toastId) {
            toast.error(message, {
                id: toastId,
                className: 'factory-toast factory-toast-error',
                duration: 6000,
                icon: '⚠️',
            });
        } else {
            toast.error(message, {
                className: 'factory-toast factory-toast-error',
                duration: 6000,
                icon: '⚠️',
            });
        }
    },

    info: (message: string) => {
        toast(message, {
            className: 'factory-toast',
            duration: 4000,
            icon: 'ℹ️',
        });
    },
};
