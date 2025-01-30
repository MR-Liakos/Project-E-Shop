import React from "react";
import { useEffect } from "react";


export default function SuccessRegister({ showModal, setShowModal }) {
    const handleClose = () => setShowModal(false);


    useEffect(() => {
        if (showModal) {
            document.body.classList.add('modal-open');
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
        } else {
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
        }
        return () => {
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
        };
    }, [showModal]);

    if (!showModal) return null;

    return (
        <div className={`modal fade ${showModal ? "show d-block" : "d-none"}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden={!showModal}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Ο λογαριασμός σας δημιουργήθηκε με επιτυχία!</h1>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                            aria-label="Close"
                        ></button>
                    </div>
                </div>
            </div>
        </div>
    )
}