import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";
import { GrFormClose } from "react-icons/gr";
import { FiSave } from "react-icons/fi";
import type { Container } from "@/models";
import { renameContainer } from "@/api";


export default function App({ open, setOpen, container, reload }: { open: boolean, setOpen: (next: boolean) => void, container: Container, reload: () => void }) {
    const [name, setName] = useState(container.name);

    const renameFunc = async () => {
        renameContainer(container.name, name).then(() => {
            setOpen(false);
            reload();
        })
    }

    return (
        <>
            <Modal
                isOpen={open}
                onOpenChange={(next) => setOpen(next)}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Rename</ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label="Name"
                                    variant="bordered"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            renameFunc()
                                        }
                                    }
                                    }
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button startContent={<GrFormClose></GrFormClose>} variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button startContent={<FiSave></FiSave>} color="success" variant="ghost" onPress={() => {
                                    renameFunc()
                                }}>
                                    Save
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
