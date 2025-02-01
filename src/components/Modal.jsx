import * as Dialog from "@radix-ui/react-dialog";

const Modal = ({ isOpen, onClose, title, description, children }) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
            <Dialog.Content
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-[500px]"
                aria-describedby="modal-description"
            >
                <Dialog.Title className="text-xl font-semibold mb-2">{title}</Dialog.Title>

                {description && (
                    <Dialog.Description id="modal-description" className="text-gray-600 text-sm mb-4">
                        {description}
                    </Dialog.Description>
                )}

                {children}

                <button
                    className="mt-4 bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 w-full"
                    onClick={onClose}
                >
                    Close
                </button>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default Modal;
