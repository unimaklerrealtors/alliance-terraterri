import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import "react-multi-carousel/lib/styles.css";
import { ImMobile } from "react-icons/im";
import { IoMdMail } from "react-icons/io";
import { MdOutlineLocationCity } from "react-icons/md";
import { LuIndianRupee } from "react-icons/lu";
import { useParams, useSearchParams } from "react-router-dom";
import { expoAdminClient } from "../utils/httpClient";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import { toastError, toastSuccess } from "../utils/toast";
import "react-phone-input-2/lib/style.css";
import { IoPersonSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { OtpInput } from "../pages/OtpInput";
import { Modal } from "../pages/Model";
import Marquee from 'react-fast-marquee';
import { Country, State, City } from "country-state-city";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import AirPropxSection from "../components/Home/AirPropxSection";
import AboutSection from "../components/Home/AboutSection";
import { getExampleNumber, parsePhoneNumberFromString } from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";

const getExpectedPhoneLength = (isoCode) => {
    if (!isoCode) isoCode = "IN";
    try {
        const example = getExampleNumber(isoCode, examples);
        return example ? example.nationalNumber.length : 10;
    } catch {
        return 10;
    }
};

const isValidMobile = (number, isoCode) => {
    if (!number) return false;
    if (!isoCode) isoCode = "IN";
    const expectedLen = getExpectedPhoneLength(isoCode);
    if (number.length !== expectedLen) return false;
    try {
        const parsed = parsePhoneNumberFromString(number, isoCode);
        return parsed ? parsed.isValid() : (number.length === expectedLen);
    } catch {
        return number.length === expectedLen;
    }
};
const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
    }
};

const Registration = () => {
    const params = useParams();
    const [searchParams] = useSearchParams();

    const expoCode = searchParams.get("expoCode") || searchParams.get("expoUnqCode") || searchParams.get("unqCode") || params.expoCode || params.unqCode || "";
    const expoId = searchParams.get("expoId") || params.expoId || "";

    const [expoData, setExpoData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState("idle");
    const [otpSending, setOtpSending] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [mobilePopup, setMobilePopup] = useState(false);
    const [errors, setErrors] = useState({});

    const initialFormState = {
        name: "",
        country: "",
        city: "",
        number: "",
        email: "",
        property: "",
        budget: "",
        location: "",
        unqCode: expoCode || "",
        expoCode: expoCode || "",
        countryCode: "+91",
        state: "",
        currency: ""
    };

    const [formData, setFormData] = useState(initialFormState);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [otpTimer, setOtpTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isNumberVerified, setIsNumberVerified] = useState(false);

    // Fetch all countries on component mount
    useEffect(() => {
        const allCountries = Country.getAllCountries();
        setCountries(allCountries);
    }, []);

    // OTP timer countdown
    useEffect(() => {
        let timer;
        if (isModalOpen && verificationStatus === "idle" && otpTimer > 0) {
            timer = setInterval(() => {
                setOtpTimer((prev) => prev - 1);
            }, 1000);
        }

        if (otpTimer === 0) {
            setCanResend(true);
        }

        return () => clearInterval(timer);
    }, [isModalOpen, otpTimer, verificationStatus]);

    // Sync expoCode into formData when expoCode is available
    useEffect(() => {
        if (expoCode) {
            setFormData(prev => ({
                ...prev,
                unqCode: expoCode,
                expoCode: expoCode
            }));
        }
    }, [expoCode]);

    // Fetch expo data when expoId or expoCode changes
    useEffect(() => {
        const fetchExpoData = async () => {
            setLoading(true);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                    },
                };

                let fetchedExpo = null;

                if (expoCode) {
                    // Fetch specific expo data
                    const res = await expoAdminClient.get(
                        `expoDetails/get.php?expoCode=${expoCode}`,
                        config
                    );

                    if (res?.data?.status) {
                        fetchedExpo = res.data.data;
                    }
                }

                // Fetch all expos data
                // const ress = await expoAdminClient.get(
                //     "NewExpo/get.php?type=future&limit=40&skip=0",
                //     config
                // );

                // if (ress?.data?.status) {
                //     const allExpos = ress.data.data || [];
                //     setExpos(allExpos);

                //     if (!fetchedExpo && expoCode) {
                //         fetchedExpo = allExpos.find(
                //             (expo) => expo.expoUnqCode === expoCode || expo.expoCode === expoCode || expo.newExpoId == expoCode
                //         );
                //     }
                //     if (!fetchedExpo && allExpos.length > 0) {
                //         fetchedExpo = allExpos[0];
                //     }
                // }

                setExpoData(fetchedExpo || null);
            } catch (err) {
                console.error("Error fetching expo data:", err);
                toastError("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchExpoData();
    }, [expoId, expoCode]);

    // Filter expos based on expoData
    // useEffect(() => {
    //     if (expoData && expos.length) {
    //         const city = expoData.expoCity;

    //         setFilteredExpos(
    //             expos.filter(
    //                 (expo) => expo.expoType === "Residential" && expo.expoCity === city
    //             )
    //         );
    //         setFilteredCom(
    //             expos.filter(
    //                 (expo) => expo.expoType === "Commercial" && expo.expoCity === city
    //             )
    //         );
    //         setFilteredBan(
    //             expos.filter(
    //                 (expo) => expo.expoType === "Banking" && expo.expoCity === city
    //             )
    //         );
    //         setFilteredIn(
    //             expos.filter(
    //                 (expo) => expo.expoType === "Interior" && expo.expoCity === city
    //             )
    //         );
    //         setFilteredInter(
    //             expos.filter(
    //                 (expo) => expo.expoType === "International" && expo.expoCity === city
    //             )
    //         );
    //     }
    // }, [expoData, expos]);

    // const groupedExpos = filteredInter.reduce((acc, cExpo) => {
    //     acc[cExpo.intCity] = acc[cExpo.intCity] || [];
    //     acc[cExpo.intCity].push(cExpo);
    //     return acc;
    // }, {});

    const handleCountryChange = (e) => {
        const selectedIsoCode = e.target.value;
        const selected = countries.find((c) => c.isoCode === selectedIsoCode);
        setSelectedCountry(selected);

        const phoneCode = selected?.phonecode ? `+${selected.phonecode}` : "";
        const currency = selected?.currency || "";

        setIsOtpVerified(false);
        setIsNumberVerified(false);

        setFormData(prev => ({
            ...prev,
            country: selected?.name || "",
            state: "",
            city: "",
            number: "",
            countryCode: phoneCode,
            currency: currency
        }));

        const statesData = selectedIsoCode ? State.getStatesOfCountry(selectedIsoCode) : [];
        setStates(statesData);
        setCities([]);
    };

    const handleStateChange = (e) => {
        const selectedIso = e.target.value;
        const selected = states.find((s) => s.isoCode === selectedIso);
        setSelectedState(selected);

        setFormData(prev => ({
            ...prev,
            state: selected.name,
            city: "",
        }));

        const cityData = City.getCitiesOfState(selectedCountry.isoCode, selectedIso);
        setCities(cityData);
    };

    const handleCityChange = (e) => {
        const selectedCityName = e.target.value;
        setSelectedCity(selectedCityName);
        setFormData(prev => ({ ...prev, city: selectedCityName }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email))
            newErrors.email = "Valid email is required";
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.city) newErrors.city = "City is required";
        
        const expectedLen = getExpectedPhoneLength(selectedCountry?.isoCode);
        const countryName = selectedCountry?.name || "India";
        if (!formData.number) {
            newErrors.number = "Phone number is required";
        } else if (!isValidMobile(formData.number, selectedCountry?.isoCode)) {
            newErrors.number = `Enter valid ${expectedLen}-digit phone number for ${countryName}`;
        } else if (!isOtpVerified) {
            newErrors.number = "Please verify your mobile number first";
        }

        if (!formData.property) newErrors.property = "Property type is required";
        if (!formData.budget) newErrors.budget = "Budget is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setSelectedCountry(null);
        setSelectedState(null);
        setSelectedCity(null);
        setStates([]);
        setCities([]);
        setIsOtpVerified(false);
        setIsNumberVerified(false);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!isOtpVerified) {
            // Swal.fire({
            //   text: "Please verify your mobile number first",
            //   position: 'right',
            //   showConfirmButton: false,
            //   timer: 3800,
            // });
            toastError("Please verify your mobile number first");
            return;
        }

        try {
            const currentExpoId = expoId || expoData?.newExpoId || "";
            const currentExpoCode = expoCode || formData.expoCode || expoData?.expoUnqCode || "";

            const payload = {
                ...formData,
                expoId: currentExpoId,
                expoCode: currentExpoCode,
                unqCode: currentExpoCode
            };

            const response = await expoAdminClient.post(
                "expoRegisters/create.php",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response?.data?.status) {
                Swal.fire({
                    title: "Thank You!",
                    html: `
            <h5>Registration Successful!</h5>
            <p>The expo link will be sent to your registered Email and WhatsApp shortly.</p>
          `,
                    icon: "success",
                    position: "right",
                    showConfirmButton: false,
                    timer: 3800,
                });
                resetForm();
            } else {
                toastError(response?.data?.message || "Something went wrong, please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            // Swal.fire({
            //   text: "An unexpected error occurred. Please try again.",
            //   showConfirmButton: false,
            //   timer: 3800,
            // });
            toastError("An unexpected error occurred. Please try again.");
        }
    };

    const requestOtp = async () => {
        const expectedLen = getExpectedPhoneLength(selectedCountry?.isoCode);
        const countryName = selectedCountry?.name || "India";
        if (!formData.number || !isValidMobile(formData.number, selectedCountry?.isoCode)) {
            const msg = `Enter valid ${expectedLen}-digit phone number for ${countryName}`;
            setErrors(prev => ({ ...prev, number: msg }));
            toastError(msg);
            return;
        }

        setOtpSending(true);
        const currentExpoId = expoId || expoData?.newExpoId || "";
        const payload = {
            phone: formData.countryCode + formData.number,
            expoId: currentExpoId
        };

        try {
            const res = await expoAdminClient.post('Otp/request-otp.php', payload);
            if (res?.data?.success || res?.data?.status) {
                toastSuccess('OTP sent to your mobile number');
                setIsModalOpen(true);
            } else {
                toastError(res?.data?.message || "Failed to send OTP. Please try again.");
            }
        } catch (err) {
            toastError('Something went wrong! Please try after sometime');
            console.error("Error requesting OTP", err);
        } finally {
            setOtpSending(false);
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [isModalOpen, verificationStatus, expoCode, expoId]);


    const handleOtpComplete = async (otp) => {
        setOtpLoading(true);
        const currentExpoId = expoId || expoData?.newExpoId || "";
        const currentExpoCode = expoCode || formData.expoCode || expoData?.expoUnqCode || "";
        const payload = {
            phone: formData.countryCode + formData.number,
            otp: otp,
            expoId: currentExpoId,
            expoCode: currentExpoCode,
            phoneNumber: formData.number,
            userName: formData.name,
            phoneCode: formData.countryCode
        };

        try {
            const res = await expoAdminClient.post("Otp/verify-otp.php", payload);
            console.log("verify-otp response:", res?.data);
            if (res?.data?.success || res?.data?.status) {
                setVerificationStatus("success");
                setIsOtpVerified(true);
                setIsNumberVerified(true);
                toastSuccess("Mobile number verified successfully");
            } else {
                setVerificationStatus("error");
                toastError(res?.data?.message || "Invalid OTP. Please try again.");
            }
        } catch (err) {
            setVerificationStatus("error");
            toastError("Error verifying OTP. Please try after sometime");
            console.error("Error verifying OTP", err);
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setOtpTimer(60);
        setCanResend(false);
        await requestOtp();
    };

    const handleTryAgain = async () => {
        setVerificationStatus("idle");
        setOtpTimer(60);
        setCanResend(false);
        await requestOtp();
    };

    const handleStartOver = () => {
        setVerificationStatus("idle");
        setIsModalOpen(false);
        setOtpTimer(60);
        setCanResend(false);
    };

    const toggleMobilePopup = () => {
        setMobilePopup(prev => !prev);
    };

    const storeUnVerifiedMobile = (mobile) => {
        // setLoading(true)
        const currentExpoId = expoId || expoData?.newExpoId || "";
        const currentExpoCode = expoCode || formData.expoCode || expoData?.expoUnqCode || "";
        const payload = {
            expoId: currentExpoId,
            expoCode: currentExpoCode,
            phoneNumber: mobile,
            userName: formData.name,
            phoneCode: formData.countryCode
        }
        try {
            expoAdminClient.post("newExpoUsers/nonVerified.php", payload)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const captureMobile = (e) => {
        const expectedLen = getExpectedPhoneLength(selectedCountry?.isoCode);
        const value = e.target.value.replace(/\D/g, '').slice(0, expectedLen);
        
        if (value !== formData.number) {
            setIsOtpVerified(false);
            setIsNumberVerified(false);
        }

        setFormData(prev => ({
            ...prev,
            number: value
        }));
        if (value.length === expectedLen) {
            storeUnVerifiedMobile(value);
        }
    };

    if (loading) return <Loader />;
    if (!expoData) return <div className="container py-5 text-center">No expo data found</div>;

    return (
        <>
            <Helmet>
                <title>Mega metaverse property Expo in Hyderabad | Discover your Dream property in Hyderabad</title>
                <meta name="description" content="Register and Explore Ultimate Realestate metaverse expo in hyderabad. Immerse, navigate and engage in real time with Hyderabad property builders. redefining realestate expos." />
                <meta name="keywords" content="International realestate expos in hyderabad | residential realestate expos in hyderabad | Commercial Realestate Expos in hyderabad | InterioR Designing Expos in hyderabad | Metaverse Dubai Property expo in hyderabad  | Metaverse realestate expo in hyderabad" />
            </Helmet>

            <section className="section banner-section section-swiper-absoulte context-dark text-center wow fadeIn">
                <div id="register_id" className="section-swiper-content pb-3">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-7 col-md-12 p-0">
                                <div className="banner_cnt">
                                    <div className="badge-promo wow fadeScale blinking-text" data-wow-delay=".6s">
                                        <span className="badge-promo-text scroll-to-registration">
                                            Register Now For Free
                                        </span>
                                        <svg className="badge-promo-icon" width="319" height="49" viewBox="0 0 319 49" fill="none">
                                            <path d="M0 0H319L299 25L319 49H0L20 25L0 0Z" fill="#d90e90"></path>
                                            <path opacity="0.08" d="M0 0H319L299 25L319 49L0 0Z" fill="white"></path>
                                        </svg>
                                    </div>
                                    <h4 className="wow fadeInUp text-spacing-200 clr_ylw text-center" data-wow-delay=".8s">
                                        Discover Your Dream Property at{" "}
                                    </h4>
                                    <h1 className="wow fadeScale text-center">
                                        <span className="loct_ot">New York</span> <br />
                                    </h1>
                                    <h2 className="bannerTypeTitle">
                                        {expoData?.expoType === "International"
                                            ? `${expoData?.intCity} Property Show`
                                            : `${expoData?.expoType} REALESTATE EXPO `}
                                        <span>in Metaverse</span>
                                    </h2>

                                    {/* <ul className="list-inline list-inline-md wow mt-3 d-flex justify-content-center" data-splitting data-wow-delay="1.5s">
                    <li>
                      <div className="unit unit-spacing-xs align-items-center">
                        <div className="unit-body">
                          <h5 className="text-spacing-100">
                            <span className="big">
                              <time>
                                {moment(expoData.fromDate).format("DD")} &{" "}
                                {moment(expoData.toDate).format("DD MMMM YYYY")}
                              </time>
                            </span>
                          </h5>
                        </div>
                      </div>
                    </li>
                  </ul> */}

                                    <div className="d-flex justify-content-center">
                                        <button type="button" className="kave-btn mobiled-noebtn" onClick={toggleMobilePopup}>
                                            Register Now
                                        </button>
                                    </div>

                                    <div className="mb-wi-90">
                                        <Carousel
                                            responsive={responsive}
                                            infinite={true}
                                            autoPlay={true}
                                            autoPlaySpeed={3000}
                                            pauseOnHover={true}
                                            arrows={false}
                                            className="bannerAdd"
                                        >
                                            <div className="col p-0">
                                                <div className="">
                                                    <div className="row align-items-center justify-content-center">
                                                        <div className="col-md-12">
                                                            <div className="sponcerBox">
                                                                <img src="/assets/images/sponsers/d-1.jpeg" alt="expo" className="dynamicImage" />
                                                                <span className="blinking-text">Diamond sponsor</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col p-0">
                                                <div className="platumBox">
                                                    <div className="row align-items-center justify-content-center">
                                                        <div className="col-md-6">
                                                            <div className="sponcerBox platm">
                                                                <img src="/assets/images/sponsers/p-1.jpeg" alt="expo" />
                                                                <span className="pl-15 blinking-text">Platiunm sponsor</span>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="sponcerBox platm">
                                                                <img src="/assets/images/sponsers/p-2.jpeg" alt="expo" />
                                                                <span className="pl-15 blinking-text">Platiunm sponsor</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col p-0">
                                                <div className="gold-img">
                                                    <div className="row align-items-center justify-content-center">
                                                        <div className="col-md-6">
                                                            <div className="sponcerBox">
                                                                <img src="/assets/images/sponsers/g-1.jpeg" alt="expo" className="mb-2" />
                                                                <span className="gl-15 blinking-text">Gold sponsor</span>
                                                            </div>
                                                            <div className="sponcerBox">
                                                                <img src="/assets/images/sponsers/g-3.jpeg" alt="expo" className="mb-2" />
                                                                <span className="gl-15 blinking-text">Gold sponsor</span>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="sponcerBox">
                                                                <img src="/assets/images/sponsers/g-2.jpeg" alt="expo" className="mb-2" />
                                                                <span className="gl-15 blinking-text">Gold sponsor</span>
                                                            </div>
                                                            <div className="sponcerBox">
                                                                <img src="/assets/images/sponsers/g-4.jpeg" alt="expo" className="mb-2" />
                                                                <span className="gl-15 blinking-text">Gold sponsor</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Carousel>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Popup Form */}
                            {mobilePopup && (
                                <>
                                    <div className="layer disnone" onClick={toggleMobilePopup}></div>
                                    <form className="rd-form rd-mailform banner_form" onSubmit={handleSubmit}>
                                        <div className="text-end" onClick={toggleMobilePopup}>X</div>
                                        <h4>Register Now</h4>
                                        <div className="row justify-content-center text-center mt-1 mb-1">
                                            <div className="col-12 pt-0">
                                                <p className="res_ot text-uppercase mb-1">
                                                    {expoData.expoTypeName} EXPO @ New York
                                                </p>
                                            </div>
                                            {/* <div className="coll">
                          <p className="mb-0">
                            {moment(expoData.fromDate).format("DD")} &{" "}
                            {moment(expoData.toDate).format("DD MMM YYYY")}
                          </p>
                        </div> */}
                                        </div>

                                        <div className="row row-sm-bottom row-20">
                                            {/* Name Field */}
                                            <div className="col-md-6 mb-1">
                                                <div className="form-wrap topp">
                                                    <IoPersonSharp />
                                                    <input
                                                        className={`form-input ${errors.name ? 'is-invalid' : ''}`}
                                                        type="text"
                                                        name="name"
                                                        onChange={handleChange}
                                                        value={formData.name}
                                                        required
                                                        placeholder="Your Name"
                                                    />
                                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                                </div>
                                            </div>

                                            {/* Email Field */}
                                            <div className="col-md-6 mb-1">
                                                <div className="form-wrap topp">
                                                    <IoMdMail />
                                                    <input
                                                        className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                                                        type="email"
                                                        name="email"
                                                        onChange={handleChange}
                                                        value={formData.email}
                                                        required
                                                        placeholder="E-mail"
                                                    />
                                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                                </div>
                                            </div>

                                            {/* Country Field */}
                                            <div className="col-md-4 mb-3">
                                                <div className="form-wrap topppp tpppp">
                                                    <MdOutlineLocationCity />
                                                    <div className="select-wrapper">
                                                        <select
                                                            className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                                                            name="country"
                                                            value={selectedCountry?.isoCode || ""}
                                                            onChange={handleCountryChange}
                                                            required
                                                        >
                                                            <option value="">Select Country</option>
                                                            {countries.map((c) => (
                                                                <option key={c.isoCode} value={c.isoCode}>
                                                                    {c.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                                                </div>
                                            </div>

                                            {/* State Field */}
                                            <div className="col-md-4 mb-3">
                                                <div className="form-wrap topppp">
                                                    <MdOutlineLocationCity />
                                                    <select
                                                        className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                                        name="state"
                                                        value={selectedState?.isoCode || ""}
                                                        onChange={handleStateChange}
                                                        required
                                                        disabled={!selectedCountry}
                                                    >
                                                        <option value="">Select State</option>
                                                        {states.map((s) => (
                                                            <option key={s.isoCode} value={s.isoCode}>
                                                                {s.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                                                </div>
                                            </div>

                                            {/* City Field */}
                                            <div className="col-md-4 mb-3">
                                                <div className="form-wrap topppp">
                                                    <MdOutlineLocationCity />
                                                    <select
                                                        className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                                        name="city"
                                                        value={selectedCity || ""}
                                                        onChange={handleCityChange}
                                                        required
                                                        disabled={!selectedState}
                                                    >
                                                        <option value="">Select City</option>
                                                        {cities.map((city) => (
                                                            <option key={city.name} value={city.name}>
                                                                {city.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                                                </div>
                                            </div>

                                            {/* Phone Number Field */}
                                            <div className="col-md-12 wths_app mb-3">
                                                <div className="row align-items-center">
                                                    <div className="col-md-7 pt-0">
                                                        <div className="form-wrap topp postion-relative phone-input-wrap">
                                                            <ImMobile className="colorchnage" />
                                                            <span className="country-code-badge">{formData.countryCode || "+91"}</span>
                                                            <input
                                                                type="tel"
                                                                className={`form-control phone-num-input ${errors.number ? 'is-invalid' : ''}`}
                                                                id="number"
                                                                name="number"
                                                                placeholder="Enter your phone number"
                                                                value={formData.number}
                                                                onChange={captureMobile}
                                                                disabled={isNumberVerified}
                                                                maxLength={getExpectedPhoneLength(selectedCountry?.isoCode)}
                                                                required
                                                            />
                                                            {errors.number && (
                                                                <div className="error text-danger">{errors.number}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5 d-flex justify-content-center align-items-center">
                                                        {isNumberVerified ? (
                                                            <div className="verified-message text-success">
                                                                <span>✓ Verified</span>
                                                                <p>Great! Your number is verified. Go ahead and complete the form</p>
                                                            </div>
                                                        ) : (
                                                            <div className="d-flex justify-content-end align-items-center w-100">
                                                                <button
                                                                    className="kave-btn btncolorc"
                                                                    type="button"
                                                                    disabled={otpSending || !isValidMobile(formData.number, selectedCountry?.isoCode)}
                                                                    onClick={requestOtp}
                                                                >
                                                                    {otpSending ? "Sending..." : "Get OTP"}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Property Type Field */}
                                            <div className="col-md-6 col-sm-12 mb-3">
                                                <div className="form-wrap">
                                                    <MdOutlineLocationCity />
                                                    <select
                                                        className={`form-control ${errors.property ? 'is-invalid' : ''}`}
                                                        name="property"
                                                        onChange={handleChange}
                                                        value={formData.property}
                                                        required
                                                    >
                                                        <option value="">Select Property</option>
                                                        <option value="residential">Residential</option>
                                                        <option value="commercial">Commercial</option>
                                                        <option value="banking">Banking</option>
                                                        <option value="interior">Interior</option>
                                                        <option value="international">International</option>
                                                    </select>
                                                    {errors.property && <div className="invalid-feedback">{errors.property}</div>}
                                                </div>
                                            </div>

                                            {/* Budget Field */}
                                            <div className="col-md-6 col-sm-12 mb-3">
                                                <div className="form-wrap">
                                                    <LuIndianRupee />
                                                    <select
                                                        className={`form-control ${errors.budget ? 'is-invalid' : ''}`}
                                                        name="budget"
                                                        onChange={handleChange}
                                                        value={formData.budget}
                                                        required
                                                    >
                                                        <option value="">Select Budget</option>
                                                        <option value="10-30 LACS">10 - 30 LACS</option>
                                                        <option value="30-60 LACS">30 - 60 LACS</option>
                                                        <option value="60-01 CR">60 - 1 CR</option>
                                                        <option value="01-02 CR">1 Cr - 2 CR</option>
                                                        <option value="02-05 CR">2 Cr - 5 CR</option>
                                                        <option value="05-10 CR">5 Cr - 10 CR</option>
                                                        <option value="10-20 CR">10 Cr - 20 CR</option>
                                                        <option value="20-50 CR">20 Cr - 50 CR</option>
                                                        <option value="50-100 CR">50 Cr - 100 CR</option>
                                                        <option value="100 CR++">100 Cr+</option>
                                                    </select>
                                                    {errors.budget && <div className="invalid-feedback">{errors.budget}</div>}
                                                </div>
                                            </div>

                                            {/* Location Field */}
                                            <div className="col-md-12 col-sm-12 mb-2">
                                                <div className="form-wrap topp">
                                                    <FaLocationDot />
                                                    <input
                                                        className="form-input"
                                                        type="text"
                                                        name="location"
                                                        onChange={handleChange}
                                                        value={formData.location}
                                                        placeholder="Property Preferred Location"
                                                    />
                                                </div>
                                            </div>

                                            {/* Terms Checkbox */}
                                            <div className="mb-3">
                                                <div className="chk-notification">
                                                    <input
                                                        type="checkbox"
                                                        id="chk-whatsapp"
                                                        name="agree"
                                                        required
                                                        onInvalid={(e) =>
                                                            e.target.setCustomValidity("You must agree to the terms to proceed.")
                                                        }
                                                        onInput={(e) => e.target.setCustomValidity("")}
                                                    />
                                                    <label htmlFor="chk-whatsapp" className="ml-10">
                                                        I Agree to Terrateri <a href="/">T&amp;C</a>,{" "}
                                                        <a href="/">Privacy Policy</a> &amp;{" "}
                                                        <a href="/">Cookie Policy</a>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <div className="col-12 text-center pt-2 pb-2">
                                                <button className="kave-btn btncolorc" type="submit" disabled={loading}>
                                                    {loading ? "Submitting..." : "Submit"}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </>
                            )}

                            {/* Desktop Form */}
                            <div className="col-lg-5 col-md-12 mobiled-noe pt-0">
                                <form className="rd-form rd-mailform banner_form" onSubmit={handleSubmit}>
                                    {/* <div className="text-end" onClick={toggleMobilePopup}>X</div> */}
                                    <h4>Register Now</h4>
                                    <div className="row justify-content-center text-center mt-1 mb-1">
                                        <div className="col-12 pt-0">
                                            <p className="res_ot text-uppercase mb-1">
                                                {expoData.expoTypeName} EXPO @ New York
                                            </p>
                                        </div>
                                        <div className="coll">
                                            {/* <p className="mb-0">
                                                {moment(expoData.fromDate).format("DD")} &{" "}
                                                {moment(expoData.toDate).format("DD MMM YYYY")}
                                            </p> */}
                                        </div>
                                    </div>

                                    <div className="row row-sm-bottom row-20">
                                        {/* Name Field */}
                                        <div className="col-md-6 mb-1">
                                            <div className="form-wrap topp">
                                                <IoPersonSharp />
                                                <input
                                                    className={`form-input ${errors.name ? 'is-invalid' : ''}`}
                                                    type="text"
                                                    name="name"
                                                    onChange={handleChange}
                                                    value={formData.name}
                                                    required
                                                    placeholder="Your Name"
                                                />
                                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                            </div>
                                        </div>

                                        {/* Email Field */}
                                        <div className="col-md-6 mb-1">
                                            <div className="form-wrap topp">
                                                <IoMdMail />
                                                <input
                                                    className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                                                    type="email"
                                                    name="email"
                                                    onChange={handleChange}
                                                    value={formData.email}
                                                    required
                                                    placeholder="E-mail"
                                                />
                                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                            </div>
                                        </div>

                                        {/* Country Field */}
                                        <div className="col-md-4 mb-3">
                                            <div className="form-wrap topppp tpppp">
                                                <MdOutlineLocationCity />
                                                <div className="select-wrapper">
                                                    <select
                                                        className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                                                        name="country"
                                                        value={selectedCountry?.isoCode || ""}
                                                        onChange={handleCountryChange}
                                                        required
                                                    >
                                                        <option value="">Select Country</option>
                                                        {countries.map((c) => (
                                                            <option key={c.isoCode} value={c.isoCode}>
                                                                {c.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                                            </div>
                                        </div>

                                        {/* State Field */}
                                        <div className="col-md-4 mb-3">
                                            <div className="form-wrap topppp">
                                                <MdOutlineLocationCity />
                                                <div className="select-wrapper">
                                                    <select
                                                        className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                                        name="state"
                                                        value={selectedState?.isoCode || ""}
                                                        onChange={handleStateChange}
                                                        required
                                                        disabled={!selectedCountry}
                                                    >
                                                        <option value="">Select State</option>
                                                        {states.map((s) => (
                                                            <option key={s.isoCode} value={s.isoCode}>
                                                                {s.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                                            </div>
                                        </div>

                                        {/* City Field */}
                                        <div className="col-md-4 mb-3">
                                            <div className="form-wrap topppp">
                                                <MdOutlineLocationCity />
                                                <div className="select-wrapper">
                                                    <select
                                                        className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                                        name="city"
                                                        value={selectedCity || ""}
                                                        onChange={handleCityChange}
                                                        required
                                                        disabled={!selectedState}
                                                    >
                                                        <option value="">Select City</option>
                                                        {cities.map((city) => (
                                                            <option key={city.name} value={city.name}>
                                                                {city.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                                            </div>
                                        </div>

                                        {/* Property Type Field */}
                                        <div className="col-md-6 col-sm-12 mb-3">
                                            <div className="form-wrap">
                                                <MdOutlineLocationCity />
                                                <div className="select-wrapper">
                                                    <select
                                                        className={`form-control ${errors.property ? 'is-invalid' : ''}`}
                                                        name="property"
                                                        onChange={handleChange}
                                                        value={formData.property}
                                                        required
                                                    >
                                                        <option value="">Select Property</option>
                                                        <option value="residential">Residential</option>
                                                        <option value="commercial">Commercial</option>
                                                        <option value="banking">Banking</option>
                                                        <option value="interior">Interior</option>
                                                        <option value="international">International</option>
                                                    </select>
                                                </div>
                                                {errors.property && <div className="invalid-feedback">{errors.property}</div>}
                                            </div>
                                        </div>

                                        {/* Budget Field */}
                                        <div className="col-md-6 col-sm-12 mb-3">
                                            <div className="form-wrap">
                                                <LuIndianRupee />
                                                <select
                                                    className={`form-control ${errors.budget ? 'is-invalid' : ''}`}
                                                    name="budget"
                                                    onChange={handleChange}
                                                    value={formData.budget}
                                                    required
                                                >
                                                    <option value="">Select Budget</option>
                                                    <option value="10-30 LACS">10 - 30 LACS</option>
                                                    <option value="30-60 LACS">30 - 60 LACS</option>
                                                    <option value="60-01 CR">60 - 1 CR</option>
                                                    <option value="01-02 CR">1 Cr - 2 CR</option>
                                                    <option value="02-05 CR">2 Cr - 5 CR</option>
                                                    <option value="05-10 CR">5 Cr - 10 CR</option>
                                                    <option value="10-20 CR">10 Cr - 20 CR</option>
                                                    <option value="20-50 CR">20 Cr - 50 CR</option>
                                                    <option value="50-100 CR">50 Cr - 100 CR</option>
                                                    <option value="100 CR++">100 Cr+</option>
                                                </select>
                                                {errors.budget && <div className="invalid-feedback">{errors.budget}</div>}
                                            </div>
                                        </div>

                                        {/* Location Field */}
                                        <div className="col-md-12 col-sm-12 mb-2">
                                            <div className="form-wrap topp">
                                                <FaLocationDot />
                                                <input
                                                    className="form-input"
                                                    type="text"
                                                    name="location"
                                                    onChange={handleChange}
                                                    value={formData.location}
                                                    placeholder="Property Preferred Location"
                                                />
                                            </div>
                                        </div>

                                        {/* Phone Number Field */}
                                        <div className="col-md-12 wths_app mb-3">
                                            <div className="row align-items-center">
                                                <div className="col-md-7 pt-0">
                                                    <div className="form-wrap topp postion-relative">
                                                        <ImMobile />
                                                        <input
                                                            type="tel"
                                                            className={`form-control phone-num ${errors.number ? 'is-invalid' : ''}`}
                                                            id="number"
                                                            name="number"
                                                            placeholder="Enter your phone number"
                                                            value={formData.number}
                                                            onChange={captureMobile}
                                                            disabled={isNumberVerified}
                                                            maxLength={getExpectedPhoneLength(selectedCountry?.isoCode)}
                                                            required
                                                        />
                                                        <input
                                                            type="text"
                                                            className="form-control phone-cod"
                                                            id="countryCode"
                                                            name="countryCode"
                                                            value={formData.countryCode}
                                                            readOnly
                                                        />
                                                        {errors.number && (
                                                            <div className="error text-danger">{errors.number}</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-md-5 d-flex justify-content-center align-items-center">
                                                    {isNumberVerified ? (
                                                        <div className="verified-message text-success">
                                                            <span>✓ Verified</span>
                                                            <p>Great! Your number is verified. Go ahead and complete the form</p>
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex justify-content-end align-items-center w-100">
                                                            <button
                                                                className="kave-btn btncolorc"
                                                                type="button"
                                                                disabled={otpSending || !isValidMobile(formData.number, selectedCountry?.isoCode)}
                                                                onClick={requestOtp}
                                                            >
                                                                {otpSending ? "Sending..." : "Get OTP"}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>


                                        {/* Terms Checkbox */}
                                        <div className="mb-3">
                                            <div className="chk-notification">
                                                <input
                                                    type="checkbox"
                                                    id="chk-whatsapp"
                                                    name="agree"
                                                    required
                                                    onInvalid={(e) =>
                                                        e.target.setCustomValidity("You must agree to the terms to proceed.")
                                                    }
                                                    onInput={(e) => e.target.setCustomValidity("")}
                                                />
                                                <label htmlFor="chk-whatsapp" className="ml-10">
                                                    I Agree to Terrateri <a href="/">T&amp;C</a>,{" "}
                                                    <a href="/">Privacy Policy</a> &amp;{" "}
                                                    <a href="/">Cookie Policy</a>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="col-12 text-center pt-2 pb-2">
                                            <button className="kave-btn btncolorc" type="submit" disabled={loading}>
                                                {loading ? "Submitting..." : "Submit"}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Sponsors Marquee */}
                        <div className="sponsor-marquee mt-0 text-start">
                            <h5>Our esteemed exhibitors</h5>
                            <Marquee speed={10} gradient={false} loop={20}>
                                <div className="marquee-content">
                                    {[1, 2, 3, 4, 5, 6].map((num) => (
                                        <div className="stand-img" key={num}>
                                            <img
                                                src={`/assets/images/sponsers/s-${num}.jpeg`}
                                                alt={`Sponsor ${num}`}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/assets/images/metaverse_bg.jpg";
                                                }}
                                            />
                                            <h6 className="blinking-text"><span>Stall</span>:s{num}</h6>
                                        </div>
                                    ))}
                                </div>
                            </Marquee>
                        </div>
                    </div>
                </div>
                <div className="dark-layer"></div>
            </section>

            <AboutSection />
            <AirPropxSection city={expoData.expoCity} />


            {/* OTP Verification Modal */}

            <Modal
                isOpen={isModalOpen}
                onClose={() => verificationStatus === "idle" && setIsModalOpen(false)}
                title="Verify Mobile Number"
            >
                <div className="text-center">
                    {verificationStatus === "idle" && (
                        <>
                            <p className="text-gray-600 mb-6">
                                Please enter the 6-digit verification code sent to your
                                registered WhatsApp number
                            </p>
                            {otpLoading ? (
                                <div className="py-4 text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2 text-gray-600">Verifying OTP...</p>
                                </div>
                            ) : (
                                <OtpInput key={verificationStatus} onComplete={handleOtpComplete} />
                            )}
                            <p className="text-sm text-gray-500 mt-4 verfi">
                                {canResend ? (
                                    <span onClick={handleResendOtp} className="resend-link">
                                        Resend OTP
                                    </span>
                                ) : (
                                    <>Resend available in {otpTimer} sec</>
                                )}
                            </p>
                        </>
                    )}

                    {verificationStatus === "success" && (
                        <div className="text-center optSuAlret">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Verification Successful!
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Your mobile number has been verified successfully.
                            </p>
                            <button onClick={handleStartOver} className="kave-btn">
                                Continue
                            </button>
                        </div>
                    )}

                    {verificationStatus === "error" && (
                        <div className="text-center optSuAlret">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-red">
                                Verification Failed
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Invalid or expired OTP. Please try again.
                            </p>
                            <button
                                onClick={handleTryAgain}
                                className="kave-btn mt-5"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default Registration;