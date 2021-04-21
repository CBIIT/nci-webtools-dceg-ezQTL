import React from 'react';
import { Button } from 'react-bootstrap';
import { updateAlert } from '../../../../services/actions';

import { useDispatch, useSelector } from 'react-redux';

export function LocusDownload() {
  const { request } = useSelector((state) => state.qtlsGWAS);
  const dispatch = useDispatch();

  return (
    <div className="px-3 py-2" style={{ minHeight: '500px' }}>
      <Button
        variant="link"
        onClick={async () => {
          const response = await fetch('api/locus-download', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ request: request }),
          });
          if (response.ok) {
            const objectURL = URL.createObjectURL(await response.blob());
            const tempLink = document.createElement('a');

            tempLink.href = `${objectURL}`;
            tempLink.setAttribute(
              'download',
              `${new Date().toISOString().split('T')[0]}.ezQTL.tar.gz`
            );
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
          } else {
            dispatch(
              updateAlert({
                show: true,
                message: `Locus Download is not available`,
                variant: 'danger',
              })
            );
          }
        }}
      >
        Save Current Session
      </Button>
    </div>
  );
}
