import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedFlow } from '@/context/MedFlowContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Patient } from '@/types';
import { Plus, Search, FileText, UserPlus, Users, Trash2, PencilIcon, ChevronRight, User } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { patients, setCurrentPatient, addPatient, updatePatient, deletePatient } = useMedFlow();
  const [search, setSearch] = useState('');
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showEditPatient, setShowEditPatient] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState<Omit<Patient, 'id'>>({
    name: '',
    age: 0,
    gender: '',
    dob: '',
    mrn: '',
    status: 'active'
  });

  const handlePatientSelect = (patient: Patient) => {
    setCurrentPatient(patient);
    navigate('/workflow');
  };

  const handleAddPatient = () => {
    const patient: Patient = {
      ...newPatient,
      id: `pat-${Date.now()}`,
    };
    addPatient(patient);
    setShowAddPatient(false);
    // Reset form
    setNewPatient({
      name: '',
      age: 0,
      gender: '',
      dob: '',
      mrn: '',
      status: 'active'
    });
  };

  const handleEditClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setNewPatient({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      dob: patient.dob,
      mrn: patient.mrn,
      status: patient.status
    });
    setShowEditPatient(true);
  };

  const handleDeleteClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowDeleteConfirm(true);
  };

  const handleUpdatePatient = () => {
    if (selectedPatient) {
      const updatedPatient: Patient = {
        ...selectedPatient,
        ...newPatient
      };
      updatePatient(updatedPatient);
      setShowEditPatient(false);
      // Reset form
      setNewPatient({
        name: '',
        age: 0,
        gender: '',
        dob: '',
        mrn: '',
        status: 'active'
      });
      setSelectedPatient(null);
    }
  };

  const handleDeletePatient = () => {
    if (selectedPatient) {
      deletePatient(selectedPatient.id);
      setShowDeleteConfirm(false);
      setSelectedPatient(null);
    }
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(search.toLowerCase()) || 
    patient.mrn.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) : value
    }));
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setNewPatient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Extract the patient ID from the full ID (e.g., "pat-1234567" -> "1234")
  const getShortId = (fullId: string) => {
    const parts = fullId.split('-');
    if (parts.length > 1) {
      return parts[1].substring(0, 4);
    }
    return fullId.substring(0, 4);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="space-y-2">
            <h1 className="heading-1">Patient Dashboard</h1>
            <p className="body-large">Comprehensive patient management and medical records</p>
          </div>
          <Button 
            onClick={() => setShowAddPatient(true)}
            className="gradient-primary button-hover gap-2 px-6 py-3 text-white shadow-medical"
          >
            <UserPlus className="h-5 w-5" />
            Add New Patient
          </Button>
        </div>
      
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-stats interactive-hover">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                <p className="text-3xl font-bold text-foreground">{patients.length}</p>
                <p className="text-xs text-muted-foreground">Registered in system</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="card-stats interactive-hover">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Active Cases</p>
                <p className="text-3xl font-bold text-foreground">
                  {patients.filter(p => p.status === 'active').length}
                </p>
                <p className="text-xs text-muted-foreground">Currently in treatment</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success-light flex items-center justify-center">
                <Users className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
          
          <div className="card-stats interactive-hover">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-3xl font-bold text-foreground">
                  {patients.filter(p => p.status === 'pending').length}
                </p>
                <p className="text-xs text-muted-foreground">Awaiting documentation</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning-light flex items-center justify-center">
                <FileText className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
        </div>
      
        {/* Patient Records Table */}
        <div className="card-elevated">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-1">
                <h2 className="heading-3">Patient Records</h2>
                <p className="body-medium">Comprehensive patient management and medical documentation</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search by name or ID..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 w-full lg:w-80 bg-surface border-border"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-surface-variant/50">
                  <TableHead className="font-semibold text-foreground">Patient ID</TableHead>
                  <TableHead className="font-semibold text-foreground">Patient Name</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold text-foreground">Date of Birth</TableHead>
                  <TableHead className="hidden lg:table-cell font-semibold text-foreground">Gender</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold text-foreground">Status</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow 
                    key={patient.id} 
                    className="border-border hover:bg-surface-variant/30 transition-colors"
                  >
                    <TableCell className="font-mono text-muted-foreground">
                      #{getShortId(patient.id)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">Age {patient.age}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {patient.dob}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {patient.gender}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        patient.status === 'active' ? 'status-active' : 
                        patient.status === 'inactive' ? 'status-inactive' : 
                        'status-pending'
                      }`}>
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePatientSelect(patient)}
                          className="hover:bg-primary-light text-primary button-hover"
                        >
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(patient)}
                          className="hover:bg-surface-variant text-muted-foreground"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(patient)}
                          className="hover:bg-destructive-light text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPatients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                          <Users className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">No patients found</p>
                          <p className="text-sm text-muted-foreground">
                            {search ? 'Try adjusting your search terms' : 'Get started by adding your first patient'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      {/* Add Patient Dialog */}
      <Dialog open={showAddPatient} onOpenChange={setShowAddPatient}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <DialogTitle className="heading-3 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Add New Patient
            </DialogTitle>
            <p className="text-muted-foreground">Enter patient information to create a new medical record</p>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={newPatient.name}
                  onChange={handleInputChange}
                  placeholder="Enter patient's full name"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium">Age *</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={newPatient.age}
                  onChange={handleInputChange}
                  placeholder="Enter age"
                  className="h-11"
                  min="0"
                  max="120"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium">Gender *</Label>
                <Select onValueChange={handleSelectChange("gender")} value={newPatient.gender}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-sm font-medium">Date of Birth *</Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={newPatient.dob}
                  onChange={handleInputChange}
                  className="h-11"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mrn" className="text-sm font-medium">Medical Record Number</Label>
                <Input
                  id="mrn"
                  name="mrn"
                  value={newPatient.mrn}
                  onChange={handleInputChange}
                  placeholder="Enter MRN (optional)"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">Patient Status</Label>
                <Select onValueChange={handleSelectChange("status")} value={newPatient.status}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAddPatient(false)} className="px-6">
              Cancel
            </Button>
            <Button onClick={handleAddPatient} className="gradient-primary px-6">
              Create Patient Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={showEditPatient} onOpenChange={setShowEditPatient}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <DialogTitle className="heading-3 flex items-center gap-2">
              <PencilIcon className="w-5 h-5 text-primary" />
              Edit Patient
            </DialogTitle>
            <p className="text-muted-foreground">Update patient information</p>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm font-medium">Full Name *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={newPatient.name}
                  onChange={handleInputChange}
                  placeholder="Enter patient's full name"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-age" className="text-sm font-medium">Age *</Label>
                <Input
                  id="edit-age"
                  name="age"
                  type="number"
                  value={newPatient.age}
                  onChange={handleInputChange}
                  placeholder="Enter age"
                  className="h-11"
                  min="0"
                  max="120"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-gender" className="text-sm font-medium">Gender *</Label>
                <Select onValueChange={handleSelectChange("gender")} value={newPatient.gender}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dob" className="text-sm font-medium">Date of Birth *</Label>
                <Input
                  id="edit-dob"
                  name="dob"
                  type="date"
                  value={newPatient.dob}
                  onChange={handleInputChange}
                  className="h-11"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-mrn" className="text-sm font-medium">Medical Record Number</Label>
                <Input
                  id="edit-mrn"
                  name="mrn"
                  value={newPatient.mrn}
                  onChange={handleInputChange}
                  placeholder="Enter MRN (optional)"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status" className="text-sm font-medium">Patient Status</Label>
                <Select onValueChange={handleSelectChange("status")} value={newPatient.status}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowEditPatient(false)} className="px-6">
              Cancel
            </Button>
            <Button onClick={handleUpdatePatient} className="gradient-primary px-6">
              Update Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the patient
              record for {selectedPatient?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePatient}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete Patient
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;