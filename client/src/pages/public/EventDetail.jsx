import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users, Clock, Tag, CheckCircle, AlertCircle, X, ShieldCheck, Smartphone } from "lucide-react";
import api from "../../services/api";

const catColor = {
  Music: "#8b5e3c", Tech: "#4a6e5a", Food: "#7a5a2a", Business: "#6b4c35",
  Party: "#a05030", Comedy: "#5a6a3a", Gala: "#8a4a5a", Wellness: "#4a7a5a", Art: "#7a4a2a",
};

/* ─── Payment methods ─── */
const PAYMENT_METHODS = [
  {
    id: "phonepe",
    label: "PhonePe",
    icon: (
      <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#5f259f"/>
        <path d="M33.5 14H25.7L16 34h7.2l2.1-4.8h5.3c4.8 0 8.4-3.2 8.4-7.8 0-4.1-2.4-7.4-5.5-7.4zm-2.7 11.2h-3.6l2.2-5.2h1.5c1.7 0 2.8 1.1 2.8 2.7 0 1.4-1.2 2.5-2.9 2.5z" fill="white"/>
      </svg>
    ),
    color: "#5f259f",
    bg: "#f3eaff",
    border: "#c9a8f5",
    upiId: "phonepe@ybl",
  },
  {
    id: "googlepay",
    label: "Google Pay",
    icon: (
      <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#fff" stroke="#e0e0e0"/>
        <text x="7" y="32" fontSize="20" fontWeight="800" fontFamily="Arial">G</text>
        <text x="7" y="32" fontSize="20" fontWeight="800" fontFamily="Arial" fill="#4285F4">G</text>
        <circle cx="24" cy="24" r="0" />
        {/* Simple G colored letters */}
        <text x="5" y="33" fontSize="22" fontWeight="900" fontFamily="'Arial Black',Arial" fill="#4285F4">G</text>
        <text x="18" y="33" fontSize="22" fontWeight="900" fontFamily="'Arial Black',Arial" fill="#EA4335">o</text>
        <text x="29" y="33" fontSize="22" fontWeight="900" fontFamily="'Arial Black',Arial" fill="#FBBC05">o</text>
      </svg>
    ),
    color: "#1a73e8",
    bg: "#e8f0fe",
    border: "#a8c4f8",
    upiId: "googlepay@okaxis",
  },
  {
    id: "paytm",
    label: "Paytm",
    icon: (
      <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#002970"/>
        <text x="5" y="30" fontSize="13" fontWeight="800" fontFamily="Arial" fill="#00BAF2">Pay</text>
        <text x="5" y="42" fontSize="10" fontWeight="700" fontFamily="Arial" fill="white">TM</text>
      </svg>
    ),
    color: "#002970",
    bg: "#e6eeff",
    border: "#a0b4e8",
    upiId: "paytm@paytm",
  },
  {
    id: "upi",
    label: "Other UPI",
    icon: (
      <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#f5f5f5" stroke="#ddd"/>
        <text x="6" y="22" fontSize="10" fontWeight="800" fontFamily="Arial" fill="#6B6B6B">UPI</text>
        <path d="M8 28 L24 36 L40 28" stroke="#ff6b35" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M24 14 L24 36" stroke="#ff6b35" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
    color: "#e25722",
    bg: "#fff2ed",
    border: "#f5b89a",
    upiId: "",
    isCustom: true,
  },
];

/* ─── Step constants ─── */
const STEP = { IDLE: "idle", CONFIRM: "confirm", PAYMENT: "payment", SUCCESS: "success" };

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  /* modal flow */
  const [step, setStep] = useState(STEP.IDLE);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [customUpi, setCustomUpi] = useState("");
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSeats(1);
    setMessage({ text: "", type: "" });
    api.get(`/events/${id}`)
      .then(res => { setEvent(res.data); setLoading(false); })
      .catch(() => { setEvent(null); setLoading(false); });
  }, [id]);

  /* opens confirmation step */
  const handleBookingClick = () => {
    if (!seats || seats <= 0) { setMessage({ text: "Please select a valid number of seats.", type: "error" }); return; }
    if (seats > event.availableSeats) { setMessage({ text: "Not enough seats available.", type: "error" }); return; }
    setMessage({ text: "", type: "" });
    setStep(STEP.CONFIRM);
    setSelectedPayment(null);
    setCustomUpi("");
  };

  /* user said YES → go to payment selection */
  const handleConfirmYes = () => setStep(STEP.PAYMENT);

  /* user said NO → close modal */
  const handleConfirmNo = () => setStep(STEP.IDLE);

  /* submit payment + real API call */
  const handlePayNow = async () => {
    const method = PAYMENT_METHODS.find(p => p.id === selectedPayment);
    if (!method) return;
    if (method.isCustom && !customUpi.trim()) { alert("Please enter your UPI ID."); return; }

    try {
      setPayLoading(true);
      await api.post("/bookings", {
        eventId: event._id,
        numberOfSeats: seats,
        totalAmount: seats * event.price,
        paymentMethod: method.id,
        upiId: method.isCustom ? customUpi.trim() : method.upiId,
      });
      setEvent(prev => ({ ...prev, availableSeats: prev.availableSeats - seats }));
      setStep(STEP.SUCCESS);
    } catch (err) {
      if (err.response?.status === 401) {
        setStep(STEP.IDLE);
        setMessage({ text: "Please login to book an event.", type: "error" });
        setTimeout(() => navigate("/login"), 1500);
        return;
      }
      const msg = err.response?.data?.message || "Payment failed. Please try again.";
      setMessage({ text: msg, type: "error" });
      setStep(STEP.IDLE);
    } finally {
      setPayLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setStep(STEP.IDLE);
    setSeats(1);
    setMessage({
      text: `🎉 Booking confirmed! ${seats} seat${seats > 1 ? "s" : ""} reserved. Check My Bookings to view.`,
      type: "success",
    });
  };

  /* ─── loading / not found ─── */
  if (loading) return (
    <div style={{ fontFamily: "'Jost', sans-serif", minHeight: "100vh", background: "#ecdcc8", display: "flex", alignItems: "center", justifyContent: "center", color: "#a88972" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #8b5e3c", borderTopColor: "transparent", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontWeight: 600 }}>Loading event details...</p>
      </div>
    </div>
  );

  if (!event) return (
    <div style={{ fontFamily: "'Jost', sans-serif", minHeight: "100vh", background: "#ecdcc8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#a88972", gap: 14 }}>
      <AlertCircle size={50} style={{ opacity: 0.35 }} />
      <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "#6b4c35" }}>Event not found.</p>
      <button onClick={() => navigate("/events")} style={{ background: "linear-gradient(135deg,#c4945a,#8b5e3c)", color: "#fff", padding: "10px 22px", borderRadius: 11, border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>
        Back to Events
      </button>
    </div>
  );

  const isFull = event.availableSeats === 0;
  const cc = catColor[event.category] || "#8b5e3c";
  const totalPrice = seats * event.price;
  const totalSeats = event.totalSeats || event.capacity || 0;
  const occupancyPct = totalSeats ? Math.round(((totalSeats - event.availableSeats) / totalSeats) * 100) : 0;
  const modalOpen = step !== STEP.IDLE;

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", minHeight: "100vh", background: "#ecdcc8", color: "#6b4c35" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Jost:wght@300;400;500;600;700&display=swap');
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.88) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes popIn   { 0%{transform:scale(0)} 60%{transform:scale(1.15)} 100%{transform:scale(1)} }
        .ed-fade  { animation: fadeUp 0.5s ease both; }
        .modal-overlay { animation: fadeIn 0.22s ease both; }
        .modal-box     { animation: scaleIn 0.28s cubic-bezier(.34,1.3,.64,1) both; }
        .pay-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.10) !important; }
        .pay-card { transition: all 0.18s ease; }
        @media(max-width:768px){ .ed-grid{ grid-template-columns:1fr !important; } }
      `}</style>

      {/* ════ MODAL OVERLAY ════ */}
      {modalOpen && (
        <div className="modal-overlay"
          style={{ position: "fixed", inset: 0, background: "rgba(30,14,4,0.6)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>

          {/* ── STEP 1: Confirm Yes / No ── */}
          {step === STEP.CONFIRM && (
            <div className="modal-box"
              style={{ background: "#faf4ec", borderRadius: 22, maxWidth: 420, width: "100%", overflow: "hidden", boxShadow: "0 24px 64px rgba(44,21,6,0.35)" }}>
              <div style={{ background: "linear-gradient(135deg,#3d1f0a,#2c1506)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "0.6rem", color: "rgba(245,236,224,0.5)", letterSpacing: "0.16em", textTransform: "uppercase", margin: "0 0 2px" }}>Booking Confirmation</p>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", color: "#f5ece0", margin: 0, fontWeight: 700 }}>Confirm Your Booking?</h2>
                </div>
                <button onClick={handleConfirmNo} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, padding: "5px 8px", cursor: "pointer", color: "#f5ece0", display: "flex" }}><X size={16}/></button>
              </div>

              <div style={{ padding: "22px 24px" }}>
                {/* Summary */}
                <div style={{ background: "#ecdcc8", borderRadius: 14, padding: "14px 16px", marginBottom: 18, border: "1px solid rgba(139,94,60,0.15)" }}>
                  <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#a88972", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Order Summary</p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: "0.82rem", color: "#6b4c35" }}>Event</span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2c1a0e", textAlign: "right", maxWidth: 200 }}>{event.title}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: "0.82rem", color: "#6b4c35" }}>Seats</span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2c1a0e" }}>{seats}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px dashed rgba(139,94,60,0.2)", marginTop: 4 }}>
                    <span style={{ fontSize: "0.86rem", fontWeight: 700, color: "#2c1a0e" }}>Total Payable</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 700, color: "#8b5e3c" }}>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <p style={{ fontSize: "0.82rem", color: "#a88972", marginBottom: 18, lineHeight: 1.6, textAlign: "center" }}>
                  Do you want to proceed with the booking and proceed to payment?
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <button onClick={handleConfirmNo}
                    style={{ padding: "12px", borderRadius: 12, background: "#ecdcc8", color: "#6b4c35", fontWeight: 700, fontSize: "0.9rem", border: "1px solid rgba(139,94,60,0.25)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                    No, Cancel
                  </button>
                  <button onClick={handleConfirmYes}
                    style={{ padding: "12px", borderRadius: 12, background: "linear-gradient(135deg,#c4945a,#8b5e3c)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(139,94,60,0.3)" }}>
                    Yes, Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Payment Method ── */}
          {step === STEP.PAYMENT && (
            <div className="modal-box"
              style={{ background: "#faf4ec", borderRadius: 22, maxWidth: 440, width: "100%", overflow: "hidden", boxShadow: "0 24px 64px rgba(44,21,6,0.35)" }}>
              <div style={{ background: "linear-gradient(135deg,#3d1f0a,#2c1506)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "0.6rem", color: "rgba(245,236,224,0.5)", letterSpacing: "0.16em", textTransform: "uppercase", margin: "0 0 2px" }}>Secure Payment</p>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", color: "#f5ece0", margin: 0, fontWeight: 700 }}>Choose Payment Method</h2>
                </div>
                <button onClick={handleConfirmNo} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, padding: "5px 8px", cursor: "pointer", color: "#f5ece0", display: "flex" }}><X size={16}/></button>
              </div>

              <div style={{ padding: "22px 24px" }}>
                {/* Amount pill */}
                <div style={{ background: "#ecdcc8", borderRadius: 12, padding: "10px 16px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid rgba(139,94,60,0.15)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ShieldCheck size={16} color="#8b5e3c" />
                    <span style={{ fontSize: "0.78rem", color: "#6b4c35", fontWeight: 600 }}>Amount to Pay</span>
                  </div>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", fontWeight: 700, color: "#8b5e3c" }}>₹{totalPrice.toLocaleString()}</span>
                </div>

                <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#a88972", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 10 }}>
                  <Smartphone size={11} style={{ verticalAlign: "middle", marginRight: 5 }} />UPI / Digital Wallets
                </p>

                {/* Payment cards */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  {PAYMENT_METHODS.filter(p => !p.isCustom).map(method => (
                    <button key={method.id} className="pay-card"
                      onClick={() => setSelectedPayment(method.id)}
                      style={{
                        padding: "14px 12px", borderRadius: 14,
                        background: selectedPayment === method.id ? method.bg : "#fff",
                        border: `2px solid ${selectedPayment === method.id ? method.border : "rgba(139,94,60,0.12)"}`,
                        cursor: "pointer", textAlign: "center", fontFamily: "inherit",
                        boxShadow: selectedPayment === method.id ? `0 0 0 3px ${method.border}44` : "0 2px 8px rgba(0,0,0,0.05)",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                      }}>
                      <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>{method.icon}</div>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: selectedPayment === method.id ? method.color : "#6b4c35" }}>{method.label}</span>
                      {selectedPayment === method.id && <CheckCircle size={14} color={method.color} />}
                    </button>
                  ))}
                </div>

                {/* Other UPI */}
                {(() => {
                  const upiMethod = PAYMENT_METHODS.find(p => p.isCustom);
                  return (
                    <button className="pay-card"
                      onClick={() => setSelectedPayment(upiMethod.id)}
                      style={{
                        width: "100%", padding: "12px 14px", borderRadius: 14,
                        background: selectedPayment === upiMethod.id ? upiMethod.bg : "#fff",
                        border: `2px solid ${selectedPayment === upiMethod.id ? upiMethod.border : "rgba(139,94,60,0.12)"}`,
                        cursor: "pointer", fontFamily: "inherit", marginBottom: 14,
                        display: "flex", alignItems: "center", gap: 12,
                        boxShadow: selectedPayment === upiMethod.id ? `0 0 0 3px ${upiMethod.border}44` : "0 2px 8px rgba(0,0,0,0.05)",
                      }}>
                      <div style={{ width: 36, height: 36, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{upiMethod.icon}</div>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: selectedPayment === upiMethod.id ? upiMethod.color : "#6b4c35", flex: 1, textAlign: "left" }}>Other UPI ID</span>
                      {selectedPayment === upiMethod.id && <CheckCircle size={15} color={upiMethod.color} />}
                    </button>
                  );
                })()}

                {/* Custom UPI input */}
                {selectedPayment === "upi" && (
                  <div style={{ marginBottom: 14 }}>
                    <input
                      type="text"
                      placeholder="Enter UPI ID (e.g. name@bank)"
                      value={customUpi}
                      onChange={e => setCustomUpi(e.target.value)}
                      style={{
                        width: "100%", padding: "11px 14px", borderRadius: 12, fontFamily: "inherit",
                        border: "1.5px solid rgba(139,94,60,0.25)", background: "#ecdcc8", color: "#2c1a0e",
                        fontSize: "0.84rem", fontWeight: 600, outline: "none", boxSizing: "border-box",
                      }}
                    />
                  </div>
                )}

                {/* Pay Now button */}
                <button
                  onClick={handlePayNow}
                  disabled={!selectedPayment || payLoading}
                  style={{
                    width: "100%", padding: "13px", borderRadius: 13,
                    background: (!selectedPayment || payLoading) ? "#dfc9af" : "linear-gradient(135deg,#c4945a,#8b5e3c)",
                    color: "#fff", fontWeight: 700, fontSize: "0.95rem", border: "none",
                    cursor: (!selectedPayment || payLoading) ? "not-allowed" : "pointer",
                    fontFamily: "inherit", boxShadow: (!selectedPayment || payLoading) ? "none" : "0 4px 16px rgba(139,94,60,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.18s",
                  }}>
                  {payLoading
                    ? <><div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} /> Processing...</>
                    : `Pay ₹${totalPrice.toLocaleString()}`
                  }
                </button>

                <p style={{ textAlign: "center", fontSize: "0.67rem", color: "#b09a8a", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  <ShieldCheck size={11} /> 100% Secure & Encrypted Payment
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 3: Success ── */}
          {step === STEP.SUCCESS && (
            <div className="modal-box"
              style={{ background: "#faf4ec", borderRadius: 22, maxWidth: 400, width: "100%", overflow: "hidden", boxShadow: "0 24px 64px rgba(44,21,6,0.35)", textAlign: "center" }}>
              <div style={{ background: "linear-gradient(135deg,#1a7a4a,#0e5a35)", padding: "28px 24px 22px" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", animation: "popIn 0.5s cubic-bezier(.34,1.56,.64,1) 0.1s both" }}>
                  <CheckCircle size={36} color="#fff" />
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#fff", margin: "0 0 4px", fontWeight: 700 }}>Payment Successful!</h2>
                <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)", margin: 0 }}>Your booking is confirmed</p>
              </div>

              <div style={{ padding: "22px 24px" }}>
                <div style={{ background: "#e8f7ef", borderRadius: 14, padding: "14px 16px", marginBottom: 18, border: "1px solid rgba(26,122,74,0.18)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: "0.78rem", color: "#6b4c35" }}>Event</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2c1a0e", textAlign: "right", maxWidth: 180 }}>{event.title}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: "0.78rem", color: "#6b4c35" }}>Seats Booked</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2c1a0e" }}>{seats}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: "0.78rem", color: "#6b4c35" }}>Payment Method</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2c1a0e" }}>
                      {PAYMENT_METHODS.find(p => p.id === selectedPayment)?.label || "UPI"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px dashed rgba(26,122,74,0.2)", marginTop: 4 }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2c1a0e" }}>Amount Paid</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 700, color: "#1a7a4a" }}>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <p style={{ fontSize: "0.8rem", color: "#a88972", marginBottom: 18, lineHeight: 1.6 }}>
                  🎟️ Your tickets have been reserved. Visit <strong>My Bookings</strong> to view and manage your booking.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <button onClick={() => navigate("/my-bookings")}
                    style={{ padding: "11px", borderRadius: 11, background: "linear-gradient(135deg,#c4945a,#8b5e3c)", color: "#fff", fontWeight: 700, fontSize: "0.82rem", border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(139,94,60,0.25)" }}>
                    My Bookings
                  </button>
                  <button onClick={handleSuccessClose}
                    style={{ padding: "11px", borderRadius: 11, background: "#ecdcc8", color: "#6b4c35", fontWeight: 700, fontSize: "0.82rem", border: "1px solid rgba(139,94,60,0.22)", cursor: "pointer", fontFamily: "inherit" }}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════ BACK BAR ════ */}
      <div style={{ background: "linear-gradient(135deg,#3d1f0a,#2c1506)", padding: "14px 24px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <button onClick={() => navigate(-1)}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", color: "#f5ece0", border: "1px solid rgba(255,255,255,0.2)", padding: "7px 16px", borderRadius: 10, fontWeight: 600, fontSize: "0.84rem", cursor: "pointer", fontFamily: "inherit" }}>
            <ArrowLeft size={15} /> Back to Events
          </button>
        </div>
      </div>

      {/* ════ MAIN CONTENT ════ */}
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "28px 24px 72px" }}>
        <div className="ed-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 26, alignItems: "start" }}>

          {/* LEFT */}
          <div className="ed-fade">
            <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 22, position: "relative", boxShadow: "0 8px 32px rgba(139,94,60,0.15)" }}>
              <img src={event.thumbnail} alt={event.title}
                style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }}
                onError={e => e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"} />
              <span style={{ position: "absolute", top: 14, left: 14, background: "rgba(250,244,236,0.93)", color: cc, fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 999 }}>
                {event.category}
              </span>
              {isFull && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(44,26,14,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ background: "#8b5e3c", color: "#fff", fontWeight: 700, fontSize: "1rem", padding: "10px 28px", borderRadius: 999, letterSpacing: "0.12em" }}>SOLD OUT</span>
                </div>
              )}
            </div>

            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 700, color: "#2c1a0e", lineHeight: 1.18, marginBottom: 18 }}>
              {event.title}
            </h1>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {[
                { icon: <Calendar size={13} />, text: new Date(event.date).toDateString() },
                { icon: <Clock size={13} />, text: event.time },
                { icon: <MapPin size={13} />, text: event.location },
                { icon: <Users size={13} />, text: isFull ? "Sold Out" : `${event.availableSeats} seats left` },
              ].map((m, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#faf4ec", border: "1px solid rgba(139,94,60,0.15)", borderRadius: 999, padding: "6px 14px", fontSize: "0.78rem", color: "#6b4c35", fontWeight: 600 }}>
                  <span style={{ color: cc }}>{m.icon}</span>{m.text}
                </span>
              ))}
            </div>

            <div style={{ background: "#faf4ec", borderRadius: 14, padding: "14px 18px", border: "1px solid rgba(139,94,60,0.14)", marginBottom: 22, display: "inline-flex", alignItems: "center", gap: 10 }}>
              <Tag size={17} color={cc} />
              <div>
                <p style={{ fontSize: "0.66rem", color: "#a88972", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Ticket Price</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.45rem", fontWeight: 700, color: "#8b5e3c", margin: 0, lineHeight: 1 }}>
                  ₹{event.price?.toLocaleString()}<span style={{ fontSize: "0.76rem", color: "#a88972", fontWeight: 600 }}> / seat</span>
                </p>
              </div>
            </div>

            <div style={{ background: "#faf4ec", borderRadius: 16, padding: "22px", border: "1px solid rgba(139,94,60,0.13)" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontWeight: 700, color: "#2c1a0e", marginBottom: 10 }}>About This Event</h2>
              <p style={{ fontSize: "0.88rem", color: "#6b4c35", lineHeight: 1.8, margin: 0 }}>{event.description}</p>
            </div>
          </div>

          {/* RIGHT: Booking card */}
          <div className="ed-fade" style={{ animationDelay: "0.15s", position: "sticky", top: 24 }}>
            <div style={{ background: "#faf4ec", borderRadius: 20, border: "1px solid rgba(139,94,60,0.15)", boxShadow: "0 8px 32px rgba(139,94,60,0.10)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#3d1f0a,#2c1506)", padding: "18px 22px" }}>
                <p style={{ fontSize: "0.62rem", color: "rgba(245,236,224,0.55)", letterSpacing: "0.16em", textTransform: "uppercase", margin: "0 0 3px" }}>SECURE YOUR SPOT</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 700, color: "#f5ece0", margin: 0 }}>Book Your Seat</h2>
              </div>

              <div style={{ padding: "20px" }}>
                {isFull ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <AlertCircle size={36} color="#8b5e3c" style={{ opacity: 0.5, marginBottom: 10 }} />
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "#8b5e3c", marginBottom: 6 }}>Sold Out</h3>
                    <p style={{ fontSize: "0.82rem", color: "#a88972", marginBottom: 14 }}>All seats have been booked.</p>
                    <button onClick={() => navigate("/events")}
                      style={{ width: "100%", padding: "10px", borderRadius: 11, background: "rgba(139,94,60,0.10)", color: "#8b5e3c", fontWeight: 700, border: "1px solid rgba(139,94,60,0.2)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.86rem" }}>
                      Browse Other Events
                    </button>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6b4c35", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Number of Seats</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ecdcc8", borderRadius: 12, padding: "5px", border: "1px solid rgba(139,94,60,0.18)", marginBottom: 5 }}>
                      <button onClick={() => seats > 1 && setSeats(s => s - 1)} disabled={seats <= 1}
                        style={{ width: 36, height: 36, borderRadius: 9, background: seats > 1 ? "#faf4ec" : "#e8d8c4", border: "none", cursor: seats > 1 ? "pointer" : "not-allowed", fontWeight: 700, fontSize: "1.1rem", color: seats > 1 ? "#8b5e3c" : "#c4b0a0", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                      <input type="number" min="1" max={event.availableSeats} value={seats}
                        onChange={e => setSeats(Math.max(1, Math.min(event.availableSeats, Number(e.target.value))))}
                        style={{ width: 52, textAlign: "center", background: "transparent", border: "none", outline: "none", fontWeight: 700, fontSize: "1.05rem", color: "#2c1a0e", fontFamily: "inherit" }} />
                      <button onClick={() => seats < event.availableSeats && setSeats(s => s + 1)} disabled={seats >= event.availableSeats}
                        style={{ width: 36, height: 36, borderRadius: 9, background: seats < event.availableSeats ? "#faf4ec" : "#e8d8c4", border: "none", cursor: seats < event.availableSeats ? "pointer" : "not-allowed", fontWeight: 700, fontSize: "1.1rem", color: seats < event.availableSeats ? "#8b5e3c" : "#c4b0a0", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                    <p style={{ fontSize: "0.7rem", color: "#a88972", textAlign: "right", marginBottom: 14 }}>Max {event.availableSeats} seats</p>

                    <div style={{ background: "#ecdcc8", borderRadius: 12, padding: "12px 14px", marginBottom: 14, border: "1px solid rgba(139,94,60,0.12)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                        <span style={{ fontSize: "0.8rem", color: "#a88972" }}>₹{event.price?.toLocaleString()} × {seats} seat{seats > 1 ? "s" : ""}</span>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2c1a0e" }}>₹{(event.price * seats).toLocaleString()}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px dashed rgba(139,94,60,0.18)" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2c1a0e" }}>Total</span>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 700, color: "#8b5e3c" }}>₹{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* ── Confirm Booking → triggers modal ── */}
                    <button onClick={handleBookingClick}
                      style={{ width: "100%", padding: "12px", borderRadius: 12, background: "linear-gradient(135deg,#c4945a,#8b5e3c)", color: "#fff", fontWeight: 700, fontSize: "0.93rem", border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(139,94,60,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      Confirm Booking
                    </button>

                    {message.text && (
                      <div style={{ marginTop: 12, padding: "10px 13px", borderRadius: 10, background: message.type === "success" ? "#e8f7ef" : "#fdecea", border: `1px solid ${message.type === "success" ? "rgba(26,122,74,0.2)" : "rgba(192,57,26,0.2)"}`, display: "flex", alignItems: "flex-start", gap: 7 }}>
                        {message.type === "success"
                          ? <CheckCircle size={15} color="#1a7a4a" style={{ flexShrink: 0, marginTop: 1 }} />
                          : <AlertCircle size={15} color="#c0391a" style={{ flexShrink: 0, marginTop: 1 }} />}
                        <p style={{ fontSize: "0.8rem", fontWeight: 600, color: message.type === "success" ? "#1a7a4a" : "#c0391a", margin: 0, lineHeight: 1.5 }}>{message.text}</p>
                      </div>
                    )}

                    <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 5, borderRadius: 999, background: "#e8d8c4", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${occupancyPct}%`, background: "linear-gradient(90deg,#8b5e3c,#c4945a)", borderRadius: 999 }} />
                      </div>
                      <span style={{ fontSize: "0.68rem", color: "#a88972", fontWeight: 600, flexShrink: 0 }}>{event.availableSeats} left</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Event details card */}
            <div style={{ background: "#faf4ec", borderRadius: 16, padding: "16px 18px", marginTop: 14, border: "1px solid rgba(139,94,60,0.13)" }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", fontWeight: 700, color: "#2c1a0e", marginBottom: 10 }}>Event Details</h3>
              {[
                { label: "Date", value: new Date(event.date).toDateString() },
                { label: "Time", value: event.time },
                { label: "Venue", value: event.location },
                { label: "Category", value: event.category },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < 3 ? "1px solid rgba(139,94,60,0.08)" : "none" }}>
                  <span style={{ fontSize: "0.74rem", color: "#a88972", fontWeight: 600 }}>{r.label}</span>
                  <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#2c1a0e", textAlign: "right", maxWidth: 170 }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;