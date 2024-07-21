import React, { createRef, useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Code, ScrollShadow } from "@nextui-org/react";
import { GrFormClose } from "react-icons/gr";
import { getLogs } from "@/api";
import type { Container } from "@/models";



export default function App({ open, setOpen, container }: { open: boolean, setOpen: (next: boolean) => void, container: Container }) {
    const [logs, setLogs] = useState<string[]>([]);
    const ScrollRef = createRef<HTMLDivElement>();

    useEffect(() => {
        getLogs(container.name).then((data) => {
            setLogs(data);
            var container = ScrollRef.current as HTMLElement
            container.scrollTop = container.scrollHeight;
        })
    }, [open])



    return (
        <>
            <Modal
                isOpen={open}
                onOpenChange={(next) => setOpen(next)}
                placement="top-center"
                size="3xl"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Logs</ModalHeader>

                            <ModalBody>
                                <ScrollShadow className="w-full h-[400px] " ref={ScrollRef}>
                                    {logs.map((log, index) => (
                                        <span key={index} className=" text-xs bg-gray-100 p-1 gap-2 flex items-center"><span className="text-primary">{index}</span>     {log}</span>
                                    ))}
                                </ScrollShadow>
                            </ModalBody>
                            <ModalFooter>
                                <Button startContent={<GrFormClose></GrFormClose>} variant="light" onPress={onClose}>
                                    Close
                                </Button>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
