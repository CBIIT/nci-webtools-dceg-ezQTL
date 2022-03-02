import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';
import { updateAlert } from '../../../../services/actions';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArchive, faFile } from '@fortawesome/free-regular-svg-icons';

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
        Click the following link to download the compressed folder, which
        includes all of the datasets after QC, colocalization results, an ezQTL
        log file, and all of the high resolution figures in svg format for
        future publication. It also includes a "snp_not_match.txt” file for the
        incompatible variants list among GWAS data, QTL data and LD matrix. A
        future session json file will also be included to enable loading of all
        these results in ezQTL for visualization.
      </p>
      {isLoading ||
      isLoadingHyprcoloc ||
      isLoadingECaviar ||
      isLoadingSummary ||
      isLoadingQC ? (
        <p>
          Disabled due to ongoing calculations, please wait for them to
          complete.
        </p>
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
        <FontAwesomeIcon icon={faFileArchive} /> Download Results
      </Button>
      <br />
      <a href="assets/files/ezQTL_Results_ReadMe_JC.txt" download>
        <FontAwesomeIcon icon={faFile} /> Download Example ReadMe Information
      </a>
    </div>
  );
}
