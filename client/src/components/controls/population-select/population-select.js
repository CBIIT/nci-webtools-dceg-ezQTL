import React, { useState, useEffect } from 'react';
import ReactSelect, { components } from 'react-select';
import { useSelector } from 'react-redux';

export const PopulationSelect = ({ id, disabled, mergeState }) => {
  const { inputs } = useSelector((state) => state.qtlsGWAS);
  const [_selectPop, _setSelectPop] = useState([]);

  useEffect(() => {
    mergeState({
      select_pop:
        _selectPop && _selectPop.length > 0
          ? _selectPop.map((item) => item.value).join('+')
          : false,
    });
  }, [_selectPop]);

  // const allPopulationValues = ["ACB", "ASW", "BEB", "CDX", "CEU", "CHB", "CHS", "CLM", "ESN", "FIN", "GBR", "GIH", "GWD", "IBS", "ITU", "JPT", "KHV", "LWK", "MSL", "MXL", "PEL", "PJL", "PUR", "STU", "TSI", "YRI"];
  // const allAfricanValues = ["YRI", "LWK", "GWD", "MSL", "ESN", "ASW", "ACB"];
  // const allMixedAmericanValues = ["MXL", "PUR", "CLM", "PEL"];
  // const allEastAsianValues = ["CHB", "JPT", "CHS", "CDX", "KHV"];
  // const allEuropeanValues = ["CEU", "TSI", "FIN", "GBR", "IBS"];
  // const allSouthAsianValues = ["GIH", "PJL", "BEB", "STU", "ITU"];
  const allPopulations = [
    // { value: "ALL", label: "(ALL) All Populations" },
    { value: 'YRI', label: '(YRI) Yoruba in Ibadan, Nigera' },
    { value: 'LWK', label: '(LWK) Luhya in Webuye, Kenya' },
    { value: 'GWD', label: '(GWD) Gambian in Western Gambia' },
    { value: 'MSL', label: '(MSL) Mende in Sierra Leone' },
    { value: 'ESN', label: '(ESN) Esan in Nigera' },
    { value: 'ASW', label: '(AWS) Americans of African Ancestry in SW USA' },
    { value: 'ACB', label: '(ACB) African Carribbeans in Barbados' },
    { value: 'MXL', label: '(MXL) Mexican Ancestry from Los Angeles, USA' },
    { value: 'PUR', label: '(PUR) Puerto Ricans from Puerto Rico' },
    { value: 'CLM', label: '(CLM) Colombians from Medellin, Colombia' },
    { value: 'PEL', label: '(PEL) Peruvians from Lima, Peru' },
    { value: 'CHB', label: '(CHB) Han Chinese in Bejing, China' },
    { value: 'JPT', label: '(JPT) Japanese in Tokyo, Japan' },
    { value: 'CHS', label: '(CHS) Southern Han Chinese' },
    { value: 'CDX', label: '(CDX) Chinese Dai in Xishuangbanna, China' },
    { value: 'KHV', label: '(KHV) Kinh in Ho Chi Minh City, Vietnam' },
    { value: 'CEU', label: '(CEU) Utah Residents from North and West Europe' },
    { value: 'TSI', label: '(TSI) Toscani in Italia' },
    { value: 'FIN', label: '(FIN) Finnish in Finland' },
    { value: 'GBR', label: '(GBR) British in England and Scotland' },
    { value: 'IBS', label: '(UBS) Iberian population in Spain' },
    { value: 'GIH', label: '(GIH) Gujarati Indian from Houston, Texas' },
    { value: 'PJL', label: '(PJL) Punjabi from Lahore, Pakistan' },
    { value: 'BEB', label: '(BRB) Bengali from Bangladesh' },
    { value: 'STU', label: '(STU) Sri Lankan Tamil from the UK' },
    { value: 'ITU', label: '(ITU) Indian Telugu from the UK' },
  ];
  const allPopulationsGrouped = [
    {
      label: '(ALL) All Populations',
      options: [{ value: 'ALL', label: '(All) All Populations' }],
    },
    {
      label: '(AFR) African',
      // name: "African",
      options: [
        { value: 'YRI', label: '(YRI) Yoruba in Ibadan, Nigera' },
        { value: 'LWK', label: '(LWK) Luhya in Webuye, Kenya' },
        { value: 'GWD', label: '(GWD) Gambian in Western Gambia' },
        { value: 'MSL', label: '(MSL) Mende in Sierra Leone' },
        { value: 'ESN', label: '(ESN) Esan in Nigera' },
        {
          value: 'ASW',
          label: '(AWS) Americans of African Ancestry in SW USA',
        },
        { value: 'ACB', label: '(ACB) African Carribbeans in Barbados' },
      ],
    },
    {
      label: '(AMR) Ad Mixed American',
      // name: "Ad Mixed American",
      options: [
        { value: 'MXL', label: '(MXL) Mexican Ancestry from Los Angeles, USA' },
        { value: 'PUR', label: '(PUR) Puerto Ricans from Puerto Rico' },
        { value: 'CLM', label: '(CLM) Colombians from Medellin, Colombia' },
        { value: 'PEL', label: '(PEL) Peruvians from Lima, Peru' },
      ],
    },
    {
      label: '(EAS) East Asian',
      // name: "East Asian",
      options: [
        { value: 'CHB', label: '(CHB) Han Chinese in Bejing, China' },
        { value: 'JPT', label: '(JPT) Japanese in Tokyo, Japan' },
        { value: 'CHS', label: '(CHS) Southern Han Chinese' },
        { value: 'CDX', label: '(CDX) Chinese Dai in Xishuangbanna, China' },
        { value: 'KHV', label: '(KHV) Kinh in Ho Chi Minh City, Vietnam' },
      ],
    },
    {
      label: '(EUR) European',
      name: 'European',
      options: [
        {
          value: 'CEU',
          label: '(CEU) Utah Residents from North and West Europe',
        },
        { value: 'TSI', label: '(TSI) Toscani in Italia' },
        { value: 'FIN', label: '(FIN) Finnish in Finland' },
        { value: 'GBR', label: '(GBR) British in England and Scotland' },
        { value: 'IBS', label: '(UBS) Iberian population in Spain' },
      ],
    },
    {
      label: '(SAS) South Asian',
      // name: "South Asian",
      options: [
        { value: 'GIH', label: '(GIH) Gujarati Indian from Houston, Texas' },
        { value: 'PJL', label: '(PJL) Punjabi from Lahore, Pakistan' },
        { value: 'BEB', label: '(BRB) Bengali from Bangladesh' },
        { value: 'STU', label: '(STU) Sri Lankan Tamil from the UK' },
        { value: 'ITU', label: '(ITU) Indian Telugu from the UK' },
      ],
    },
  ];

  useEffect(() => {
    const parsePopulation =
      inputs && inputs['select_pop'][0].length > 0
        ? inputs['select_pop'][0]
            .split('+')
            .map(
              (item) => allPopulations.filter((pop) => pop.value === item)[0]
            )
        : [];
    _setSelectPop(parsePopulation);
  }, [inputs]);

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      width: '450px',
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '16px',
    }),
  };

  const removeAll = (arr, removeArr) => {
    return arr.filter((item) => !removeArr.includes(item));
  };

  const containsAll = (arr, target) => target.every((v) => arr.includes(v));

  const Option = (props) => {
    return (
      props.data.value !== 'ALL' && (
        <components.Option {...props}>
          <span
            style={{
              marginLeft: props.data.value === 'ALL' ? '0px' : '15px',
            }}
          >
            {props.data.label}
          </span>
        </components.Option>
      )
    );
  };

  const selectHeader = (data) => {
    // console.log("population group selected", data);
    if (data.options[0].value !== 'ALL') {
      if (
        containsAll(
          _selectPop.map((item) => item.value),
          data.options.map((item) => item.value)
        )
      ) {
        _setSelectPop(
          removeAll(
            _selectPop.map((item) => item.value),
            data.options.map((item) => item.value)
          ).map((item) => allPopulations.filter((pop) => pop.value === item)[0])
        );
      } else {
        _setSelectPop(
          [
            ...new Set(
              _selectPop
                .map((item) => item.value)
                .concat(data.options.map((item) => item.value))
            ),
          ].map((item) => allPopulations.filter((pop) => pop.value === item)[0])
        );
      }
    } else {
      if (_selectPop.length >= 26) {
        _setSelectPop([]);
      } else {
        _setSelectPop(allPopulations);
      }
    }
  };

  const GroupHeading = (props) => (
    <components.GroupHeading
      {...props}
      style={{
        textDecoration: 'underline',
        cursor: 'pointer',
        color: 'black',
        fontSize: '16px',
        textTransform: 'none',
      }}
      onClick={(_) => selectHeader(props.data)}
    />
  );

  const MultiValueLabel = (props) => {
    return _selectPop.length >= 26 ? (
      props.data.value === 'YRI' && (
        <components.MultiValueLabel {...props}>
          (ALL) All Populations
        </components.MultiValueLabel>
      )
    ) : (
      <components.MultiValueLabel {...props}>
        {props.data.value}
      </components.MultiValueLabel>
    );
  };

  const MultiValueRemove = (props) => {
    return <></>;
  };

  return (
    <ReactSelect
      value={_selectPop}
      onChange={(item) => {
        // console.log("onChange", item);
        _setSelectPop(item);
      }}
      inputId={id}
      isMulti={true}
      options={allPopulationsGrouped}
      components={{
        Option,
        GroupHeading,
        MultiValueLabel,
        MultiValueRemove,
      }}
      styles={customStyles}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      isSearchable={false}
      isClearable={false}
      backspaceRemovesValue={false}
      isDisabled={disabled}
      menuPortalTarget={document.body}
    />
  );
};
