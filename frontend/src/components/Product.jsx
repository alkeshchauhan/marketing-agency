import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Spinner, Alert, Container, Form, Button } from 'react-bootstrap'

// NOTE: Vite exposes env vars on import.meta.env. Set VITE_API_BASE to your backend base URL
const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

function Product() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Add-product form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [stock, setStock] = useState('')
  const [sku, setSku] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [socialMediaType, setSocialMediaType] = useState('')
  const [socialMediaLink, setSocialMediaLink] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [formError, setFormError] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formSuccess, setFormSuccess] = useState(null)

  // fetch products helper so we can call it after adding
  async function fetchProducts(signal) {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${apiBase}/api/products/1`, { signal })
      if (!res.ok) throw new Error(`Server responded ${res.status}`)
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const abort = new AbortController()
    fetchProducts(abort.signal)
    return () => abort.abort()
  }, [])

  const resetForm = () => {
    setName('')
    setDescription('')
    setPrice('')
    setCategoryId('')
    setStock('')
    setSku('')
    setCompanyId('')
    setSocialMediaType('')
    setSocialMediaLink('')
    setImageFile(null)
    setFormError(null)
    setFormSuccess(null)
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)

    if (!name || !price) return setFormError('Name and Price are required')

    const fd = new FormData()
    fd.append('name', name)
    fd.append('description', description)
    fd.append('price', price)
    if (categoryId) fd.append('category_id', categoryId)
    if (stock) fd.append('stock', stock)
    if (sku) fd.append('sku', sku)
    if (companyId) fd.append('company_id', companyId)
    if (socialMediaType) fd.append('social_media_type', socialMediaType)
    if (socialMediaLink) fd.append('social_media_product_link', socialMediaLink)
    if (imageFile) fd.append('image', imageFile)

    try {
      setFormLoading(true)
      const res = await fetch(`${apiBase}/api/products/`, {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || `Server responded ${res.status}`)
      setFormSuccess('Product created successfully')
      resetForm()
      // reload products
      fetchProducts()
    } catch (err) {
      setFormError(err.message || 'Failed to create product')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <Container className="py-4">
      <h3 className="mb-3">Add Product</h3>
      {formError && <Alert variant="danger">{formError}</Alert>}
      {formSuccess && <Alert variant="success">{formSuccess}</Alert>}
      <Form onSubmit={handleAddProduct} className="mb-4">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-2" controlId="pName">
              <Form.Label>Name *</Form.Label>
              <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2" controlId="pPrice">
              <Form.Label>Price *</Form.Label>
              <Form.Control type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-2" controlId="pDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Group>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-2" controlId="pCategory">
              <Form.Label>Category (ID)</Form.Label>
              <Form.Control type="number" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-2" controlId="pStock">
              <Form.Label>Stock</Form.Label>
              <Form.Control type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-2" controlId="pSku">
              <Form.Label>SKU</Form.Label>
              <Form.Control value={sku} onChange={(e) => setSku(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-2" controlId="pCompany">
              <Form.Label>Company ID</Form.Label>
              <Form.Control type="number" value={companyId} onChange={(e) => setCompanyId(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2" controlId="pSocialType">
              <Form.Label>Social Media Type</Form.Label>
              <Form.Control value={socialMediaType} onChange={(e) => setSocialMediaType(e.target.value)} placeholder="e.g., Instagram, Facebook" />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-2" controlId="pSocialLink">
          <Form.Label>Social Media Link</Form.Label>
          <Form.Control value={socialMediaLink} onChange={(e) => setSocialMediaLink(e.target.value)} placeholder="https://..." />
        </Form.Group>

        <Form.Group className="mb-3" controlId="pImage">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" onChange={(e) => setImageFile(e.target.files && e.target.files[0])} />
        </Form.Group>

        <Button type="submit" disabled={formLoading}>{formLoading ? 'Saving...' : 'Add Product'}</Button>
      </Form>

      <h3 className="mb-3">Products</h3>

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">Error loading products: {error}</Alert>
      ) : !products.length ? (
        <Alert variant="info">No products found.</Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-3">
          {products.map((p) => (
            <Col key={p.id || p.encrypt_id}>
              <Card className="h-100">
                {p.image ? (
                  <Card.Img variant="top" src={p.image} alt={p.name} style={{ objectFit: 'cover', height: 160 }} />
                ) : (
                  <div style={{ height: 160, background: '#f1f1f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <small className="text-muted">No image</small>
                  </div>
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="mb-2" style={{ fontSize: '1rem' }}>{p.name}</Card.Title>
                  <Card.Text className="text-muted mb-2" style={{ fontSize: '.9rem' }}>{p.description}</Card.Text>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <strong>${p.price}</strong>
                    <small className={`badge ${p.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>{p.status}</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default Product