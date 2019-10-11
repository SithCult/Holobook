//> React
// Contains all the functionality necessary to define React components
import React from 'react';

//> Additional modules
// Name generation
import { nameByRace } from 'fantasy-name-generator';
// Fetching
import axios from 'axios';
// Country list
import countryList from 'react-select-country-list';
// Fade In Animation
import FadeIn from 'react-fade-in';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBSelect,
  MDBBtn,
  MDBIcon,
} from 'mdbreact';

//> Components
import {
  AboutUs
} from '../../molecules/modals';

//> CSS
import './registerform.scss';

//> Images
import IMGgroup from '../../../assets/images/group.png';
import IMGlogo from '../../../assets/images/logo_white.png';

// Country list
const countries = countryList().getData();

class HomePage extends React.Component {

  state = {
    name: "",
    email: "",
    sn: "",
    country: {},
  };

  componentDidMount = () => {
    this._getIPData();
  }

  submitHandler = event => {
    event.preventDefault();
    event.target.className += " was-validated";
  }

  changeHandler = event => {
    if(event.target.name === "sn"){
      if (/\s/.test(event.target.value)) {
        return false;
      }
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSelectChange = event => {
    this.setState({
      cc: event[0]
    });
  }

  handleCheckboxChange = event => {
    this.setState({
      [event.target.name]: event.target.checked
    })
  }

  _fetchAllCountries = (country) => {
    let allCountries = countries.map((c, i) => {
        return({
            text: c.label,
            value: c.value,
            checked: c.value === country ? true : false
        });
    });
    this.setState({
        countries: allCountries
    });
  }


  _generateRandomName = () => {
    let creatures = [
      "angel",
      "cavePerson",
      "darkelf",
      "demon",
      "dragon",
      "drow",
      "dwarf",
      "fairy",
      "goblin",
      "halfdemon",
      "highfairy",
      "human",
      "ogre",
      "orc"
    ];

    /**
     * Genders
     * This is not meant ot offend persons with different genders. The module used
     * requires clear inputs acknowledging only female and male as valid parameters.
     */
    let genders = [
      "female",
      "male"
    ];

    let results = {
      creature: creatures[Math.floor(Math.random()*creatures.length)],
      gender: genders[Math.floor(Math.random()*genders.length)]
    }

    return {
      name: nameByRace(results.creature, { gender: results.gender, allowMultipleNames: false }),
      creature: results.creature,
      gender: results.gender
    }
  }

  generateName = () => {
    /**
      * Check the possibility that a name contains a space.
      * This generator was tested and therefore "gnome" and "halfling" were excluded from use.
      * "elf" and "highelf" has been removed due to its special chars in its name.
      * It was tested using 1.000.000 names - which seems solid.
      * However, if a name still has a space in it, create a new name.
      */
    let generation = this._generateRandomName();
    if (!/\s/.test(generation.name)) {
      this.setState({
        sn: generation.name
      });
    }
  }
  
  _getIPData = async () => {
    // Get country data from ipapi
    await axios.get('https://ipapi.co/json/').then((response) => {
        let data = response.data;
        this.setState({
            country: data
        }, () => this._fetchAllCountries(data.country));
    }).catch((error) => {
        console.log(error);
    });
  }

  render() {
    console.log(this.state);
    return (
      <MDBContainer id="register" className="text-center text-white mt-5 pt-5">
        <div className="mb-4">
          <img className="img-fluid" src={IMGlogo} alt="SithCult logo"/>
        </div>
        <p className="lead mt-4">
        Become part of the world's largest Sith-Imperial organization.
        </p>
        <AboutUs />
        <div className="register-form mt-5 ">
          <div className="group">
            <img className="img-fluid" src={IMGgroup} alt="SithCult logo"/>
          </div>
          <h1 
          className="h1-responsive font-weight-bold text-center my-2"
          >
          Join us now
          </h1>
          <p>
          Do you have any questions? Please do not hesitate to 
          <a 
          className="ml-1 mr-1 underlined"
          href="mailto:center@sithcult.com"
          >
          contact us directly
          </a>-
          Our team will come back to you within matter of hours to help you.
          </p>
          <form
            className="needs-validation text-left"
            onSubmit={this.submitHandler}
            noValidate
          >
          <MDBRow>
            <MDBCol md="6">
              <MDBInput
                value={this.state.name}
                onChange={this.changeHandler}
                type="text"
                id="materialFormRegisterConfirmEx1"
                name="name"
                outline
                label="Your full name"
              >
                <small id="emailHelp" className="form-text text-muted">
                  To contact you, we require your real name. But do not worry 
                  - <strong>we protect your identity</strong>. Your name will not be shared on any media.
                </small>
              </MDBInput>
            </MDBCol>
            <MDBCol md="6">
              <MDBInput
                value={this.state.email}
                onChange={this.changeHandler}
                type="email"
                id="materialFormRegisterConfirmEx2"
                name="email"
                outline
                label="Your email"
              >
                <small id="emailHelp" className="form-text text-muted">
                  Like your real name, your private E-Mail will not be shared.
                </small>
              </MDBInput>
            </MDBCol>
            <MDBCol md="6">
              <MDBInput
                value={this.state.sn}
                onChange={this.changeHandler}
                type="text"
                id="materialFormRegisterConfirmEx3"
                outline
                name="sn"
                label="Fictional name (Sith Name)"
              >
                <small id="emailHelp" className="form-text text-muted">
                  You need to choose a fictional name. This will be your valid SithCult name 
                  that will be used in every conversation and in contact with other members.
                </small>
              </MDBInput>
            </MDBCol>
            <MDBCol md="6">
              <MDBBtn
              color="red"
              onClick={this.generateName}
              >
              <MDBIcon icon="sync-alt" className="pr-2" />
              Random name
              </MDBBtn>
            </MDBCol>
          </MDBRow>
          {(this.state.name !== "" && this.state.email !== "" && this.state.sn !== "") &&
            <FadeIn>
            <MDBRow>
              <MDBCol md="6">
                <MDBSelect
                  search
                  options={this.state.countries}
                  value={"AT"}
                  getValue={this.handleSelectChange}
                  className="select-countries"
                  selected="Choose your country"
                  label="Your country"
                  labelClass="text-white"
                  outline
                />
              </MDBCol>
              <MDBCol md="6">
              </MDBCol>
              <MDBCol md="12" className="mt-3">
                <hr/>
                <p className="lead font-weight-bold">More about you</p>
              </MDBCol>
              <MDBCol md="6">
                <MDBInput 
                label="I own a stunt-lightsaber"
                containerClass="my-2"
                checked={this.state.ls}
                onChange={this.handleCheckboxChange}
                name="ls"
                type="checkbox"
                id="checkbox1"
                />
              </MDBCol>
              <MDBCol md="6">
              {this.state.ls &&
                <MDBInput 
                label="My lightsaber is red or purple"
                containerClass="my-2"
                checked={this.state.lsc}
                onChange={this.handleCheckboxChange}
                name="lsc"
                type="checkbox"
                id="checkbox2"
                />
              }
              </MDBCol>
              <MDBCol md="6">
                <MDBInput 
                label="I am familiar with the history of the Sith"
                type="checkbox"
                containerClass="my-2"
                checked={this.state.fam}
                onChange={this.handleCheckboxChange}
                name="fam"
                id="checkbox5"
                />
              </MDBCol>
              <MDBCol md="6">
              </MDBCol>
              <MDBCol md="6">
                <MDBInput 
                label="I want to get involved in building up SithCult"
                type="checkbox"
                containerClass="my-2"
                checked={this.state.inv}
                onChange={this.handleCheckboxChange}
                name="inv"
                id="checkbox10"
                />
              </MDBCol>
              <MDBCol md="6">
              {this.state.inv &&
              <FadeIn>
              <p className="font-weight-bold">How would you like to assist us?</p>
                <MDBInput 
                label="Establishing your local SithCult cluster"
                type="checkbox"
                containerClass="my-2"
                checked={this.state.invCluster}
                onChange={this.handleCheckboxChange}
                name="invCluster"
                id="checkbox11"
                />
                <MDBInput 
                label="Handing out flyers"
                type="checkbox"
                containerClass="my-2"
                checked={this.state.invFlayers}
                onChange={this.handleCheckboxChange}
                name="invFlayers"
                id="checkbox12"
                />
                <MDBInput 
                label="Promoting us at events"
                type="checkbox"
                containerClass="my-2"
                checked={this.state.invPromote}
                onChange={this.handleCheckboxChange}
                name="invPromote"
                id="checkbox13"
                />
                <MDBInput 
                label="Telling your friends about SithCult"
                type="checkbox"
                containerClass="my-2"
                checked={this.state.invTelling}
                onChange={this.handleCheckboxChange}
                name="invTelling"
                id="checkbox14"
                />
                <MDBInput 
                label="Donating services"
                type="checkbox"
                containerClass="my-2"
                checked={this.state.invServices}
                onChange={this.handleCheckboxChange}
                name="invServices"
                id="checkbox15"
                />
                <MDBInput 
                label="Donating money"
                type="checkbox"
                containerClass="my-2"
                checked={this.state.invMoney}
                onChange={this.handleCheckboxChange}
                name="invMoney"
                id="checkbox16"
                />
                <MDBInput 
                label="Something else"
                type="checkbox"
                containerClass="my-2"
                checked={this.state.invOther}
                onChange={this.handleCheckboxChange}
                name="invOther"
                id="checkbox17"
                />
                {this.state.invOther &&
                  <MDBInput 
                  type="textarea"
                  label="What can you do for us?"
                  rows="2"
                  name="invOtherText"
                  value={this.state.invOtherText}
                  outline
                  onChange={this.changeHandler}
                  />
                }
              </FadeIn>
              }
              </MDBCol>
              <MDBCol md="12">
                <MDBInput 
                type="textarea"
                label="Would you like to add something?"
                rows="3"
                name="additional"
                outline
                value={this.state.additional}
                onChange={this.changeHandler}
                />
              </MDBCol>
              <MDBCol md="6">
                <MDBInput 
                label="I want to receive additional information via E-mail"
                type="checkbox"
                containerClass="my-2"
                checked={this.state.checkEmail}
                onChange={this.handleCheckboxChange}
                name="checkEmail"
                id="checkbox20"
                />
                <small 
                className="form-text text-muted"
                >
                You can change your mind at any time by clicking the unsubscribe link 
                in the footer of any email you receive from us, or by contacting center@sithcult.com.
                </small>
              </MDBCol>
              <MDBCol md="6">
                <MDBInput 
                label="I want to receive information and awards via letters"
                type="checkbox"
                containerClass="my-2"
                checked={this.state.checkLetter}
                onChange={this.handleCheckboxChange}
                name="checkLetter"
                id="checkbox25"
                />
                <small 
                className="form-text text-muted"
                >
                You can change your mind at any time by contacting center@sithcult.com.
                </small>
                {this.state.checkLetter &&
                <FadeIn>
                  <MDBInput
                    value={this.state.city}
                    onChange={this.changeHandler}
                    type="text"
                    id="materialFormRegisterConfirmEx10"
                    outline
                    name="city"
                    label="City"
                  >
                  </MDBInput>
                  <MDBInput
                    value={this.state.zip}
                    onChange={this.changeHandler}
                    type="text"
                    id="materialFormRegisterConfirmEx11"
                    outline
                    name="zip"
                    label="Postal code (ZIP)"
                  >
                  </MDBInput>
                  <MDBInput
                    value={this.state.address}
                    onChange={this.changeHandler}
                    type="text"
                    id="materialFormRegisterConfirmEx12"
                    outline
                    name="address"
                    label="Address"
                  >
                  </MDBInput>
                </FadeIn>
                }
              </MDBCol>
              <MDBCol md="12">
                <MDBInput 
                label={
                <span>
                I have read and agree to the
                <a 
                href='/privacy'
                target="_blank"
                className="ml-1 underlined"
                >
                Privacy Policy
                </a>
                </span>
                }
                type="checkbox"
                containerClass="my-2"
                checked={this.state.checkPrivacy}
                onChange={this.handleCheckboxChange}
                name="checkPrivacy"
                id="checkbox30"
                />
                <MDBInput 
                label="I agree, that the data from this form is being stored and used by 
                SithCult in order for you to receive any service"
                type="checkbox"
                containerClass="my-2"
                checked={this.state.checkData}
                onChange={this.handleCheckboxChange}
                name="checkData"
                id="checkbox31"
                />
              </MDBCol>
            </MDBRow>
            </FadeIn>
          }

          </form>
        </div>
      </MDBContainer>
    );
  }
}

export default HomePage;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
