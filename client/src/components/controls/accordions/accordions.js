import React, { useState } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import './accordions.scss';

const { Header, Body } = Card;
const { Toggle, Collapse } = Accordion;

// Bootstrap 4 Accordion with all cards open by default
export default function Accordions({ components, bodyClass }) {
  const [toggleCollapse, setCollpase] = useState(
    components.reduce(
      (acc, component, index) => ({
        ...acc,
        [`${index}`]: component.collapseDefault,
      }),
      {}
    )
  );

  return (
    <div className="accordions">
      {components.map(({ title, collapseDefault, component }, index) => {
        return (
          <Accordion
            defaultActiveKey={collapseDefault ? null : `${index}`}
            key={`${index}`}
          >
            <Card>
              <Toggle
                className="font-weight-bold d-flex justify-content-between"
                as={Header}
                eventKey={`${index}`}
                onClick={() =>
                  setCollpase({
                    ...toggleCollapse,
                    [`${index}`]: !toggleCollapse[`${index}`],
                  })
                }
              >
                {title}
                <FontAwesomeIcon
                  className="align-self-center"
                  icon={
                    toggleCollapse[`${index}`] ? faChevronDown : faChevronUp
                  }
                />
              </Toggle>
              <Collapse eventKey={`${index}`}>
                <Body className={bodyClass}>{component}</Body>
              </Collapse>
            </Card>
          </Accordion>
        );
      })}
    </div>
  );
}
