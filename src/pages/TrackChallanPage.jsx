import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicApiBase, getApiOrigin } from "../api";
import { resolveTrustedAssetUrl } from "../utils/safeUrl";
import "./TrackChallanPage.css";

function TrackStatus({ data }) {
  const badgeClass = data.status === "delivered" ? "delivered" : "pending";
  return (
    <span className={`track-badge ${badgeClass}`}>{data.status}</span>
  );
}

export default function TrackChallanPage() {
  const { challan_no } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);

    const url = `${getPublicApiBase()}/challan/${encodeURIComponent(challan_no || "")}`;

    fetch(url, { headers: { Accept: "application/json" } })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(body.error || "Challan not found");
        }
        return body;
      })
      .then((body) => {
        if (!cancelled) setData(body);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Could not load this challan");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [challan_no]);

  if (loading) {
    return (
      <div className="track-page">
        <div className="track-wrap">
          <div className="track-card">
            <div className="track-state">Loading challan details…</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="track-page">
        <div className="track-wrap">
          <div className="track-card">
            <div className="track-state">
              <h1>Challan not found</h1>
              <p>{error || "This code does not match a job."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const apiOrigin = getApiOrigin();
  const logoUrl = resolveTrustedAssetUrl(data.logo_url, apiOrigin);
  const photos = (data.photos || [])
    .map((src) => resolveTrustedAssetUrl(src, apiOrigin))
    .filter(Boolean);

  return (
    <div className="track-page">
      <div className="track-wrap">
        <div className="track-card">
          <div
            className="track-bar"
            style={{ background: data.theme_color || "#114e9e" }}
          />
          <div className="track-head">
            {logoUrl ? (
              <img className="track-logo" src={logoUrl} alt="" />
            ) : null}
            <h1>{data.company}</h1>
            {data.tagline ? <p className="track-muted">{data.tagline}</p> : null}
            <TrackStatus data={data} />
          </div>

          <div className="track-section">
            {data.details
              ?.filter((d) => d.label && d.value)
              .map((d) => (
                <div className="track-row" key={d.label}>
                  <div className="label">{d.label}</div>
                  <div className="value">{d.value}</div>
                </div>
              ))}

            {data.items?.length ? (
              <>
                <h2>Items</h2>
                <ul className="track-items">
                  {data.items.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              </>
            ) : null}

            {photos.length ? (
              <>
                <h2>Photos</h2>
                <div className="track-photos">
                  {photos.map((src, idx) => (
                    <img key={idx} src={src} alt="" />
                  ))}
                </div>
              </>
            ) : null}

            {(data.company_address || data.company_phone) ? (
              <>
                <h2>Shop</h2>
                {data.company_address ? (
                  <div className="track-row">
                    <div className="label">Address</div>
                    <div className="value">{data.company_address}</div>
                  </div>
                ) : null}
                {data.company_phone ? (
                  <div className="track-row">
                    <div className="label">Phone</div>
                    <div className="value">{data.company_phone}</div>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>

          {data.footer_note ? (
            <div className="track-foot">{data.footer_note}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}