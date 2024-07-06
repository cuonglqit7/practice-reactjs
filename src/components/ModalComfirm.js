import { Modal, Button } from "react-bootstrap";
import { deleteUser } from "../services/UserService";
import { toast } from "react-toastify";

const ModalComfirm = (props) => {
    const { show, handleClose, dataUserDelete, handleDeleteFromUser } = props;

    const handleDelete = async () => {
        let res = await deleteUser(dataUserDelete.id);
        if (res && +res.statusCode === 204) {
            handleDeleteFromUser(dataUserDelete);
            toast.success("Delete user successfully!");
            handleClose();
        } else toast.error("Delete user failed");
    };
    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Delete User: {dataUserDelete.first_name}{" "}
                        {dataUserDelete.last_name}{" "}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>Are you sure?</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleDelete}>
                        Comfirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalComfirm;
