import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';
import { updateAlert } from '../../../../services/actions';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArchive } from '@fortawesome/free-regular-svg-icons';

export function LocusDownload() {
  const [loading, setLoading] = useState(false);
  const {
    request,
    isLoading,
    isLoadingHyprcoloc,
    isLoadingECaviar,
    isLoadingSummary,
    isLoadingQC,
  } = useSelector((state) => state.qtlsGWAS);
  const dispatch = useDispatch();

  return (
    <div className="px-3 py-2" style={{ minHeight: '500px' }}>
      <LoadingOverlay active={loading} />
      <p>
        Download all files and images inputed and generated from this session.
      </p>
      {isLoading ||
      isLoadingHyprcoloc ||
      isLoadingECaviar ||
      isLoadingSummary ||
      isLoadingQC ? (
        <p>Disabled due to ongoing calculations, please wait for them to complete.</p>
      ) : (
        <p></p>
      )}
      <Button
        variant="link"
        disabled={
          isLoading ||
          isLoadingHyprcoloc ||
          isLoadingECaviar ||
          isLoadingSummary ||
          isLoadingQC
        }
        onClick={async () => {
          setLoading(true);
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
          setLoading(false);
        }}
      >
        <FontAwesomeIcon icon={faFileArchive} /> Save Current Session
      </Button>
    </div>
  );
}
