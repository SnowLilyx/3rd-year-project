function matmul(x, y) {
  return [x[0]*y[0]+x[1]*y[3]+x[2]*y[6],
          x[0]*y[1]+x[1]*y[4]+x[2]*y[7],
          x[0]*y[2]+x[1]*y[5]+x[2]*y[8],
          x[3]*y[0]+x[4]*y[3]+x[5]*y[6],
          x[3]*y[1]+x[4]*y[4]+x[5]*y[7],
          x[3]*y[2]+x[4]*y[5]+x[5]*y[8],
          x[6]*y[0]+x[7]*y[3]+x[8]*y[6],
          x[6]*y[1]+x[7]*y[4]+x[8]*y[7],
          x[6]*y[2]+x[7]*y[5]+x[8]*y[8]]
          
}

function matvec(x, y) {
  return [x[0]*y[0]+x[1]*y[1]+x[2]*y[2],
          x[3]*y[0]+x[4]*y[1]+x[5]*y[2],
          x[6]*y[0]+x[7]*y[1]+x[8]*y[2]]
}

function magnitude(v) {
  return Math.sqrt((v[0] ** 2) + (v[1] ** 2) + (v[2] ** 2))
}

function normalise(v) {
  const mag = magnitude(v)
  if (isZero(mag)) {console.log("Normalising too small vector: " + v)}
  return v.map(x => x/mag)
}

function crossProd(v,  w) {
  return [v[1]*w[2]-v[2]*w[1], v[2]*w[0]-v[0]*w[2], v[0]*w[1]-v[1]*w[0]]
}

function determinant(M) {
  return M[0]*(M[4]*M[8] - M[5]*M[7]) - M[1]*(M[3]*M[8] - M[5]*M[6]) + M[2]*(M[3]*M[6]-M[4]*M[7])
}

function Rz(t) {
  return [Math.cos(t), Math.sin(t), 0, -Math.sin(t), Math.cos(t), 0, 0, 0, 1]
}

function Rv(v, t) {
  const n = normalise(v)
  const x = n[0]
  const y = n[1]
  const z = n[2]
  const c = Math.cos(t)
  const s = Math.sin(t)
  return [c + x*x*(1-c),   x*y*(1-c) - z*s, x*z*(1-c) + y*s,
          y*x*(1-c) + z*s, c + y*y*(1-c),   y*z*(1-c) - x*s,
          z*x*(1-c) - y*s, z*y*(1-c) + x*s, c + z*z*(1-c)  ]
}

function linInt(matrix, factor) {
  return [1+(matrix[0]-1)*factor, matrix[1]*factor, matrix[2]*factor,
          matrix[3]*factor, 1+(matrix[4]-1)*factor, matrix[5]*factor,
          matrix[6]*factor, matrix[7]*factor, 1+(matrix[8]-1)*factor]
}

function isZero(f) {
  return Math.abs(f) < Math.pow(10, -8)
}

function gaussianelimination(d, e, f) {
  // Sort vectors
  const v = [...d]
  const u = [...e]
  const w = [...f]
  function compare(a, b) {
    const x = !isZero(a[0]) || (isZero(b[0]) && (!isZero(a[1]) || (isZero(b[1]) && (!isZero(a[2])))))
    return (x ? -1 : 1)
  }
  var res = [v, u, w]
  res.sort(compare)

  // Elimate u[0], w[0], and w[1] if they are non-zero (to make matrix triangular)
  if (!isZero(res[1][0])) {
    for (i=2; i>=0; i--) {
      res[1][i] = res[0][i]*res[1][0] - res[1][i]*res[0][0]
    }
  }
  if (!isZero(res[2][0])) {
    for (i=2; i>=0; i--) {
      res[2][i] = res[0][i]*res[2][0] - res[2][i]*res[0][0]
    }
  }
  res.sort(compare)
  if (!isZero(res[2][1])) {
    for (i=2; i>=1; i--) {
      res[2][i] = res[1][i]*res[2][1] - res[2][i]*res[1][1]
    }
  }
  return res
  
}

function findeigenvector(M) {
  // Coefficients of the characteristic polynomial
  const a = -1
  const b = M[0] + M[4] + M[8]
  const c = M[7]*M[5] + M[1]*M[3] + M[2]*M[6] - M[0]*M[4] - M[4]*M[8] - M[0]*M[8]
  const d = M[1]*M[5]*M[6] + M[2]*M[3]*M[7] + M[0]*M[4]*M[8] - M[0]*M[5]*M[7] - M[1]*M[3]*M[8] - M[2]*M[4]*M[6]
  
  const discriminant = 18*a*b*c*d - 4*b*b*b*d + b*b*c*c - 4*a*c*c*c - 27*a*a*d*d
  const del0 = b*b - 3*a*c
  const del1 = 2*b*b*b - 9*a*b*c + 27*a*a*d

  // Two or more eigenvalues??
  if (discriminant > 0 || (discriminant == 0 && !isZero(del0))) {return null}
  
  // One eigenvalue, so find it
  var lambda = 0
  if (isZero(discriminant)) {lambda = (-b)/(3*a)}
  else {
    const rt = del1*del1 - 4*del0*del0*del0
    if (rt < 0) {console.log("We have a problem")}
    var C = 0
    if (isZero(del1 + Math.sqrt(rt))) {C = Math.cbrt((del1 - Math.sqrt(rt)) / 2)}
    else {C = Math.cbrt((del1 + Math.sqrt(rt)) / 2)}
    lambda = (-1/(3*a))*(b + C + (del0/C))
  }

  const M2 = [M[0]-lambda, M[1], M[2], M[3], M[4]-lambda, M[5], M[6], M[7], M[8]-lambda]
  // Solve for normalised eigenvector here? Mv = lambdav => M2v = 0
  const res = gaussianelimination([M2[0],M2[1],M2[2]], [M2[3],M2[4],M2[5]], [M2[6],M2[7],M2[8]])
  var x, y, z = 0
  if (res[0][0] == 0 && res[0][1] == 0 && res[0][2] == 0) {
    return null
  } else if (res[1][0] == 0 && res[1][1] == 0 && res[1][2] == 0) {
    return null
  }

  // res[2] must be [0, 0, 0] because must be an infinite number of eigenvectors - we know the null space exists

  if (res[0][0] == 0) {
    x = 1; y = 0; z = 0
  } else if (res[1][1] == 0) {
    z = 0; y = 1; x = -res[0][1]/res[0][0]
  } else {
    z = 1; y = -res[1][2]/res[1][1]; x = (-1/res[0][0])*(res[0][1]*y + res[0][2])
  }

  console.log("Eigenvector", [x, y, z])
  return normalise([x, y, z])
}