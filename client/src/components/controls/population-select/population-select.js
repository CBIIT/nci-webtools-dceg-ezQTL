import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import ReactSelect, { components } from 'react-select';

export const PopulationSelect = ({
  id,
  // value,
  disabled,
  // onChange
}) => {

  const [selectedPop, setSelectedPop] = useState([]);

  useEffect(() => {
    console.log("USEEFFECT", selectedPop);
  }, [selectedPop]);

  const allPopulationValues = ["ACB", "ASW", "BEB", "CDX", "CEU", "CHB", "CHS", "CLM", "ESN", "FIN", "GBR", "GIH", "GWD", "IBS", "ITU", "JPT", "KHV", "LWK", "MSL", "MXL", "PEL", "PJL", "PUR", "STU", "TSI", "YRI"];
  const allAfricanValues = ["YRI", "LWK", "GWD", "MSL", "ESN", "ASW", "ACB"];
  const allMixedAmericanValues = ["MXL", "PUR", "CLM", "PEL"];
  const allEastAsianValues = ["CHB", "JPT", "CHS", "CDX", "KHV"];
  const allEuropeanValues = ["CEU", "TSI", "FIN", "GBR", "IBS"];
  const allSouthAsianValues = ["GIH", "PJL", "BEB", "STU", "ITU"];

  const populations = [
    { value: "ALL", label: "(ALL) All Populations" },
    {
      label: "(AFR) African",
      // name: "African",
      options: [
        { value: "YRI", label: "(YRI) Yoruba in Ibadan, Nigera" },
        { value: "LWK", label: "(LWK) Luhya in Webuye, Kenya" },
        { value: "GWD", label: "(GWD) Gambian in Western Gambia" },
        { value: "MSL", label: "(MSL) Mende in Sierra Leone" },
        { value: "ESN", label: "(ESN) Esan in Nigera" },
        { value: "ASW", label: "(AWS) Americans of African Ancestry in SW USA" },
        { value: "ACB", label: "(ACB) African Carribbeans in Barbados" },
      ]
    },
    {
      label: '(AMR) Ad Mixed American',
      // name: "Ad Mixed American",
      options: [
        { value: "MXL", label: "(MXL) Mexican Ancestry from Los Angeles, USA" },
        { value: "PUR", label: "(PUR) Puerto Ricans from Puerto Rico" },
        { value: "CLM", label: "(CLM) Colombians from Medellin, Colombia" },
        { value: "PEL", label: "(PEL) Peruvians from Lima, Peru" },
      ]
    },
    {
      label: "(EAS) East Asian",
      // name: "East Asian",
      options: [
        { value: "CHB", label: "(CHB) Han Chinese in Bejing, China" },
        { value: "JPT", label: "(JPT) Japanese in Tokyo, Japan" },
        { value: "CHS", label: "(CHS) Southern Han Chinese" },
        { value: "CDX", label: "(CDX) Chinese Dai in Xishuangbanna, China" },
        { value: "KHV", label: "(KHV) Kinh in Ho Chi Minh City, Vietnam" },
      ]
    },
    {
      label: "(EUR) European",
      name: "European",
      options: [
        { value: "CEU", label: "(CEU) Utah Residents from North and West Europe" },
        { value: "TSI", label: "(TSI) Toscani in Italia" },
        { value: "FIN", label: "(FIN) Finnish in Finland" },
        { value: "GBR", label: "(GBR) British in England and Scotland" },
        { value: "IBS", label: "(UBS) Iberian population in Spain" },
      ]
    },
    {
      label: "(SAS) South Asian",
      // name: "South Asian",
      options: [
        { value: "GIH", label: "(GIH) Gujarati Indian from Houston, Texas" },
        { value: "PJL", label: "(PJL) Punjabi from Lahore, Pakistan" },
        { value: "BEB", label: "(BRB) Bengali from Bangladesh" },
        { value: "STU", label: "(STU) Sri Lankan Tamil from the UK" },
        { value: "ITU", label: "(ITU) Indian Telugu from the UK" },
      ]
    }
  ];

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      width: '450px',
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '16px',
    }),
  }

  const containsAll = (arr, target) => target.every(v => arr.includes(v));

  const selectAll = () => {
    console.log("all populations selected");
    if (selectedPop.length >= 26 && selectedPop.filter((pop) => pop.value === 'ALL').length === 0) {
      console.log("ADD ALL TO ALL POPULATIONS");
      let allPopulations = [];
      populations.map((group) => {
        if ('options' in group) {
          group.options.map((item) => {
            allPopulations.push(item);
          })
        }
      });
      allPopulations.push(populations.filter((pop) => pop.value === 'ALL')[0]);
      console.log("allPopulations", allPopulations);
      setSelectedPop(allPopulations);
    } 
    if (selectedPop.length >= 26 && selectedPop.filter((pop) => pop.value === 'ALL').length > 0) {
      console.log("CLEAR ALL POPULATIONS");
      let allPopulations = [];
      setSelectedPop(allPopulations);
    } 
    if (selectedPop.filter((pop) => pop.value === 'ALL').length === 0) {
      console.log("SELECT ALL POPULATIONS");
      let allPopulations = [];
      populations.map((group) => {
        if ('options' in group) {
          group.options.map((item) => {
            allPopulations.push(item);
          })
        }
      });
      allPopulations.push(populations.filter((pop) => pop.value === 'ALL')[0]);
      console.log("allPopulations", allPopulations);
      setSelectedPop(allPopulations);
    }
    // populations.map((group) => {
    //   if ('options' in group) {
    //     group.options.map((item) => {
    //       allPopulations.push(item);
    //     })
    //   }
    // });
    // allPopulations.push(populations.filter((pop) => pop.value === 'ALL')[0]);
    // console.log("allPopulations", allPopulations);
    // setSelectedPop(allPopulations);
  };

  const Option = props => {
    return (
      <components.Option {...props}>
        <span style={{
          marginLeft: props.data.value === 'ALL' ? '0px' : '15px'
        }}>
          {props.data.label}
        </span>
      </components.Option>
    );
  };

  const selectHeader = (data) => {
    console.log("population group selected", data);
    setSelectedPop(data.options);
  };

  const GroupHeading = props => (
    <components.GroupHeading {...props} style={{
      textDecoration: 'underline',
      cursor: 'pointer',
      color: 'black',
      fontSize: '16px',
      textTransform: 'none'
    }} onClick={_ => selectHeader(props.data)} />
  );

  const MultiValueLabel = props => {
    // return (
    //   selectedPop.filter((pop) => pop.value === 'ALL').length === 0 ? 
    //   (
    //       <components.MultiValueLabel {...props}>
    //         {props.data.value === 'ALL' ? props.data.label : props.data.value}
    //       </components.MultiValueLabel>
    //   ) : 
    //   (
    //     props.data.value === 'ALL' && 
    //     <components.MultiValueLabel {...props}>
    //       {props.data.label}
    //     </components.MultiValueLabel>
    //   )
    // )
    return (
      selectedPop.filter((pop) => pop.value === 'ALL').length > 0 ?
      (
        <div style={{
          display: props.data.value === 'ALL' ? 'block' : 'none'
        }}>
          <components.MultiValueLabel {...props}>
            { props.data.label }
          </components.MultiValueLabel>
        </div>
      ) : 
      (
        <components.MultiValueLabel {...props}>
          { props.data.value }
        </components.MultiValueLabel>
      )
    )
  };

  const MultiValueRemove = props => {
    return (
      <></>
    );
  };

  return (
    <ReactSelect
      value={selectedPop}
      onChange={(item) => {
        console.log("ITEM", item);
        if (item.filter((pop) => pop.value === 'ALL').length > 0) {
          selectAll();
        } else if (item.length >= 26) {
          selectAll();
        } else {
          setSelectedPop(item);
        }
      }}
      inputId={id}
      isMulti={true}
      options={populations}
      components={{ Option, GroupHeading, MultiValueLabel, MultiValueRemove }}
      styles={customStyles}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      isSearchable={false}
      isClearable={false}
      backspaceRemovesValue={false}
      isDisabled={disabled}
    />
  );
}
