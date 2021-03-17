import React, { useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup'

export function LocusColocalization() {
  const [radioValue, setRadioValue] = useState('hyprcoloc');

  const radios = [
    { name: 'HyPrColoc', value: 'hyprcoloc' },
    { name: 'eCAVIAR', value: 'ecaviar' }
  ];

  return (
    <div className="px-3 py-2" style={{ minHeight: '500px' }}>
      <div className="mb-2 d-flex justify-content-center">
        <ButtonGroup toggle>
          {radios.map((radio, idx) => (
            <ToggleButton
              key={idx}
              type="radio"
              variant="primary"
              name="radio"
              value={radio.value}
              checked={radioValue === radio.value}
              onChange={(e) => setRadioValue(e.currentTarget.value)}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>
      {
        radioValue === 'hyprcoloc' && (
          <>
            <p>
              Hypothesis Prioritization in multi-trait Colocalization (<a href="https://github.com/jrs95/hyprcoloc" target="_blank" rel="noreferrer">HyPrColoc</a>) analyses (Foley <i>et al</i>. 2019 bioRxiv 592238). 
              The first table shows the colocalization results including the following information:  
            </p>
            <ul>
              <li>Traits: a cluster of putatively colocalized traits. The last column shows which gene QTLs are colocalized with GWAS.</li>
              <li>Posterior Probability: the posterior probability that these traits are colocalized</li>
              <li>Regional association probability: always {'>'} the posterior probability. Please see Foley <i>et al</i> for details</li>
              <li>Candidate SNP: a candidate causal variant explaining the shared association</li>
              <li>Posterior Explained By SNP: the proportion of the posterior probability explained by the Candidate SNP (which represents the HyPrColoc multi-trait fine-mapping probability).</li>
            </ul>
            <p>
              HyPrColoc analysis will be performed based on the user-defined cis-QTL Distance on the input file loading page. Only overlapping SNPs between GWAS and QTLs are used for colocalization analysis.
            </p>

            <div style={{overflowX: 'auto'}}>
              TABLE
            </div>

            <p>
              The second table outputs the SNP score of all variants for each pair of colocalized traits. For detailed information, please check the manual of <a href="https://github.com/jrs95/hyprcoloc" target="_blank" rel="noreferrer">HyPrColoc</a>.
            </p>      

            <div style={{overflowX: 'auto'}}>
              TABLE
            </div>
          </>
        )
      }
      {
        radioValue === 'ecaviar' && (
          <>
            <p>
              eCAVIAR is a novel probabilistic model for integrating GWAS and eQTL data that extends the CAVIAR framework to 
              explicitly estimate the posterior probability of the same variant being causal in both GWAS and eQTL studies, 
              while accounting for allelic heterogeneity and LD. This approach can quantify the strength between a causal variant 
              and its associated signals in both studies, and it can be used to colocalize variants that pass the genome-wide significance 
              threshold in GWAS. For detailed information, please check the <a href="http://zarlab.cs.ucla.edu/tag/ecaviar/" target="_blank" rel="noreferrer">eCAVIAR paper</a>.  
            </p>
            <p>
              vQTL performs the eCAVIAR analysis for each gene in QTL data together with GWAS data. Two results will be reported based on the number of SNPs tested: 
              SNPs in up to +/- 100 kb range as specified in cis-QTL Distance (CLPP and Prob_in_pCausalSet) or +/- 50 SNPs (CLPP2 and Prob_in_pCausalSet2) around 
              the GWAS lead SNP. If there are less than +/- 10 SNPs around the GWAS lead SNP (or LD reference SNP) within the user-specified cis-QTL Distance, 
              the analysis will not be performed. vQTL combines GWAS, QTL, and eCAVIAR results into one table as shown below. If no QTLs are found for GWAS lead 
              SNP (Lead SNP included=”N”), vQTL will use the nearest variant as a locational proxy of “GWAS lead SNP” for the eCAVIAR analysis. Only overlapping 
              SNPs between GWAS and QTLs are used for colocalization analysis.
            </p>

            <div style={{overflowX: 'auto'}}>
              TABLE
            </div>
          </>
        )
      }
    </div>
  );
}
