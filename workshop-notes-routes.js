// Agregar estas rutas al archivo ~/server-pro/src/routes/requests.js

// GET /api/requests/:id/workshop-notes
// Obtener todas las notas internas de un ticket
router.get('/:id/workshop-notes', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    
    const notes = await db.query(
      `SELECT id, request_id, user_id, user_name, comment, created_at 
       FROM workshop_notes 
       WHERE request_id = ? 
       ORDER BY created_at ASC`,
      [id]
    )
    
    res.json(notes)
  } catch (err) {
    console.error('Error fetching workshop notes:', err)
    res.status(500).json({ error: 'Error al obtener notas' })
  }
})

// POST /api/requests/:id/workshop-notes
// Crear una nueva nota interna en un ticket
router.post('/:id/workshop-notes', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { comment } = req.body
    const userId = req.user?.id
    const userName = req.user?.name || req.user?.email || 'Usuario'
    
    // Validar entrada
    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: 'El comentario no puede estar vacío' })
    }
    
    // Verificar que la solicitud existe
    const request = await db.query('SELECT id FROM requests WHERE id = ?', [id])
    if (!request.length) {
      return res.status(404).json({ error: 'Solicitud no encontrada' })
    }
    
    // Insertar nota
    const result = await db.query(
      `INSERT INTO workshop_notes (request_id, user_id, user_name, comment) 
       VALUES (?, ?, ?, ?)`,
      [id, userId, userName, comment.trim()]
    )
    
    const newNote = {
      id: result.insertId,
      request_id: id,
      user_id: userId,
      user_name: userName,
      comment: comment.trim(),
      created_at: new Date().toISOString()
    }
    
    res.status(201).json(newNote)
  } catch (err) {
    console.error('Error creating workshop note:', err)
    res.status(500).json({ error: 'Error al crear la nota' })
  }
})
