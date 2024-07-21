"use client"
import { useState, useEffect } from 'react';
import { Container } from '@/models';
import { addCommand, addContainerVolume, addEnvironment, addPort, changeUser, getLogs, listContainers, pauseContainer, removeCommand, removeContainer, removeContainerVolume, removeEnvironment, removePort, renameContainer, startContainer, stopContainer, updateCommand, updateEnvironment, updatePort } from '@/api';
import { Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, cn, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, DropdownSection, Input, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import {
    PiArrowFatDownDuotone, PiTrashLight, PiPlayLight, PiStopLight, PiPauseLight, PiCursorTextLight,
    PiUserCircleMinusLight, PiMemoryLight, PiListMagnifyingGlassLight, PiShippingContainerLight
} from "react-icons/pi";
import { VscGistSecret } from "react-icons/vsc";
import { MdSettingsEthernet } from "react-icons/md";
import { HiOutlineCommandLine } from "react-icons/hi2";




const ContainersPage = () => {
    const [containers, setContainers] = useState<Container[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContainers = async () => {
            setLoading(true);
            try {
                const data = await listContainers();
                const parsed = data.map((container: Container) => {
                    return {
                        key: container.id,
                        id: container.id,
                        name: container.name,
                        status: <Status data={container.status}></Status>,
                        action: <DropdownComponent item={container} reload={() => {
                            fetchContainers();

                        }}></DropdownComponent>
                    };
                }) as any;
                setContainers(parsed);

            } catch (error) {
                console.error('Error fetching containers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContainers();
    }, []);




    if (loading) return <div>Loading...</div>;

    const columns = [
        {
            key: "name",
            label: "NAME",
        },
        {
            key: "id",
            label: "ID",
        },
        {
            key: "status",
            label: "STATUS",
        },
        {
            key: "action",
            label: "ACTION",
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Docker Containers</h1>
            <Table aria-label="Example table with dynamic content">
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={containers}>
                    {(item) => (
                        <TableRow key={item.key}>
                            {(columnKey) => <TableCell>{item[columnKey as keyof Container] as string}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

import Rename from './modals/rename'
import Logs from './modals/logs'

const DropdownComponent = ({ item, reload }: { item: Container, reload: () => void }) => {
    const [renameOpen, setRenameOpen] = useState(false);
    const [logsOpen, setLogsOpen] = useState(false);
    return <div>
        <Dropdown backdrop="blur">
            <DropdownTrigger>
                <Button
                    variant="ghost"
                    isIconOnly
                    radius="full"
                >
                    <PiShippingContainerLight />
                </Button>
            </DropdownTrigger>
            <DropdownMenu variant="faded" aria-label="Dropdown menu with icons"
                onAction={async (key) => {

                    switch (key) {
                        case "start":
                            await startContainer(item.name).then(() => {
                                reload();
                            })
                            break;
                        case 'pause':
                            await pauseContainer(item.name).then(() => {
                                reload();
                            })
                            break;
                        case 'stop':
                            await stopContainer(item.name).then(() => {
                                reload();
                            })
                            break;
                        case 'remove':
                            await removeContainer(item.name).then(() => {
                                reload();
                            })
                            break;
                        case 'logs':
                            setLogsOpen(true);

                            break;
                        case 'rename':
                            setRenameOpen(true);
                            break;
                        default:
                            break;
                    }

                }}
            >
                <DropdownSection title="Execution Controls">
                    <DropdownItem
                        key="start"
                        className='text-success'
                        color="success"
                        startContent={<PiPlayLight />}
                    >
                        Start
                    </DropdownItem>
                    <DropdownItem
                        key="pause"
                        className='text-warning'
                        color="warning"
                        startContent={<PiPauseLight />}
                    >
                        Pause
                    </DropdownItem>
                    <DropdownItem
                        key="stop"
                        className='text-danger'
                        color="danger"
                        startContent={<PiStopLight />}
                    >
                        Stop
                    </DropdownItem>
                    <DropdownItem
                        key="logs"
                        startContent={<PiListMagnifyingGlassLight />}
                    >
                        Logs
                    </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Properties">
                    <DropdownItem
                        key="rename"
                        startContent={<PiCursorTextLight />}
                    >
                        Rename
                    </DropdownItem>
                    <DropdownItem
                        key="change-user"
                        startContent={<PiUserCircleMinusLight />}
                    >
                        Change User
                    </DropdownItem>
                    <DropdownItem
                        key="port-settings"
                        startContent={<MdSettingsEthernet />}
                    >
                        Port Settings
                    </DropdownItem>
                    <DropdownItem
                        key="volume-settings"
                        startContent={<PiMemoryLight />}
                    >
                        Volume Settings
                    </DropdownItem>

                    <DropdownItem
                        key="command-settings"
                        startContent={<HiOutlineCommandLine />}
                    >
                        Command Settings
                    </DropdownItem>
                    <DropdownItem
                        key="environment-settings"
                        startContent={<VscGistSecret />}
                    >
                        Environment Settings
                    </DropdownItem>

                </DropdownSection>
                <DropdownSection title="Danger zone">
                    <DropdownItem
                        key="remove"
                        className='text-danger'
                        color="danger"
                        startContent={<PiTrashLight />}
                    >
                        Remove
                    </DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
        <Rename open={renameOpen} setOpen={() => setRenameOpen(false)} reload={reload} container={item}></Rename>
        <Logs open={logsOpen} setOpen={() => setLogsOpen(false)} container={item}></Logs>
    </div>
}

const Status = ({ data }: { data: string }) => {
    switch (data) {
        case "running":
            return <Chip color="success" ><span className='flex items-center gap-1 text-white'><PiPlayLight></PiPlayLight> Running</span></Chip>
        case "exited":
            return <Chip color="danger"><span className='flex items-center gap-1 text-white'><PiStopLight></PiStopLight> Exited</span></Chip>
        default:
            return <Chip color="danger"><span className='flex items-center gap-1 text-white'><PiStopLight></PiStopLight> {data}</span></Chip>

    }
}
export default ContainersPage;
