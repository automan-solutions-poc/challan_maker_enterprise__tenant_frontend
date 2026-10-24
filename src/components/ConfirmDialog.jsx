import React, { useCallback, useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";

/**
 * Promise-based replacement for window.confirm.
 *   const [confirm, confirmDialog] = useConfirm();
 *   if (!(await confirm({ title, body, confirmLabel, tone: "danger" }))) return;
 *   ...render {confirmDialog} once in the page.
 */
export function useConfirm() {
  const [request, setRequest] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback(
    (options) =>
      new Promise((resolve) => {
        resolver.current = resolve;
        setRequest(options);
      }),
    []
  );

  const close = (result) => {
    resolver.current?.(result);
    resolver.current = null;
    setRequest(null);
  };

  const dialog = (
    <Modal show={!!request} onHide={() => close(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{request?.title}</Modal.Title>
      </Modal.Header>
      {request?.body && <Modal.Body className="text-muted">{request.body}</Modal.Body>}
      <Modal.Footer>
        <Button variant="secondary" onClick={() => close(false)}>
          {request?.cancelLabel || "Cancel"}
        </Button>
        <Button
          variant={request?.tone === "danger" ? "danger" : "primary"}
          onClick={() => close(true)}
          autoFocus
        >
          {request?.confirmLabel || "Confirm"}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return [confirm, dialog];
}
