import React, { createRef, useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Code, ScrollShadow } from "@nextui-org/react";
import { GrFormClose } from "react-icons/gr";
import { getLogs } from "@/api";
import type { Container } from "@/models";
import { ws } from "@/app/page";


export default function App({ open, setOpen, container }: { open: boolean, setOpen: (next: boolean) => void, container: Container }) {
    const [logs, setLogs] = useState<string[]>([]);
    //const ScrollRef = createRef<HTMLDivElement>();
    const [term, setTerm] = useState<string[]>([]);

    useEffect(() => {
        // getLogs(container.name).then((data) => {
        //     //setLogs(data);
        //     var container = ScrollRef.current as HTMLElement
        //     container.scrollTop = container.scrollHeight;
        // })




        ws.onmessage = (event) => {
            console.log(event.data);

            setTerm([...term, event.data]);
        };

    },
        [open])



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
                            <div className="container mx-auto mt-10">
                                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                                    <div id="output" className="h-64 overflow-y-auto bg-black p-2 rounded">
                                        {term.map((log, index) => (
                                            <span key={index} className="text-xs text-white p-1 gap-2 flex items-center">  {log}</span>
                                        ))}
                                    </div>
                                    <input id="commandInput"
                                        onKeyPress={(event) => {
                                            if (event.key === 'Enter') {
                                                const command = event.target.value;
                                                ws.send(command);
                                                event.target.value = '';
                                            }
                                        }}
                                        type="text" className="w-full p-2 mt-4 bg-gray-700 rounded" placeholder="Enter command..." />
                                </div>
                            </div>
                            <ModalBody>
                                <ScrollShadow className="w-full h-[400px] "
                                >
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
